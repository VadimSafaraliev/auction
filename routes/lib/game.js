var express = require('express');
var router = express.Router();
var db = require('./db');
var price, minPrice, timePriceChange, sizePriceChange,  goodId, goodName;
exports.endflag = false;
exports.startflag = false;
exports.wait = true;
var wiskey=false;
var wiskeyBuy=false;
//�������� ������
exports.start = function (numberSessions) {
    //����� ������, ����� � �������� ����
    exports.wait = false;
    exports.endflag = false;
    exports.startflag = true;
    //���������� � ����������, ����� ��� ������� �� �������� ����� ������
    //���� ������ ��������� ������������� ������
    if (numberSessions <= 0) exports.stopTimer();
    price = 100;
    randGoods();
    minPrice = rand(1, 99);
    timePriceChange = rand(1, 3);
    //��������� ������, �������� ����
    var timer = setInterval(function () {
        sizePriceChange = rand(1, 10);
        if (price < minPrice) {
            exports.stopTimer();
        }
        else {
            price = price - sizePriceChange;
        }
        //�������� � index ����� ���������� �� ������� /sync json-������
        exports.price = price;
        exports.goodName = goodName;
        exports.numberSessions = numberSessions;
    }, timePriceChange * 500);
    //������������� ������, ��������� ������� ������ ��������
    exports.stopTimer = function () {
        clearInterval(timer);
        //���� ���� ������ � �������� 20 �� �����
        db.Users.find(function (err, users) {
            if (users) {
                for (var i = 0; i < users.length; i++) {
                    users[i].score = users[i].score - 20;
                    users[i].save();
                }
            }
        });
        numberSessions--;
        if (numberSessions == 0) {
            exports.end();
            exports.endflag=true;
        } else {
            exports.start(numberSessions);
        }
        wiskey=false;
    };
    //������� ������� ������
    exports.buy = function (username) {
        db.Goods.findOne({goodid: goodId}, function (err, good) {
            if (good) {
                db.Users.findOne({name: username}, function (err, user) {
                    if(wiskey)
                    {
                        price = Math.round(price/2);
                        if (user.cash > price) {
                            user.cash = user.cash - price;
                            //��������� 40, ����� � ����� � ���� ��� ����� ���� �� 20 ������, � � ���� �� 20 ������
                            user.score = user.score + 40;
                            user.save(function (err, result) {
                                //����� ���������� � ���� ������������� ������
                                exports.stopTimer();
                            });
                            wiskeyBuy=false;
                            var newBought = new db.Boughts({name: username, goods: good.name, price: price});
                            newBought.save();
                        }
                    }
                    else {
                        if (user.cash > price) {
                            user.cash = user.cash - price;
                            //��������� 40, ����� � ����� � ���� ��� ����� ���� �� 20 ������, � � ���� �� 20 ������
                            user.score = user.score + 40;
                            user.save(function (err, result) {
                                //����� ���������� � ���� ������������� ������
                                exports.stopTimer();
                            });
                            var newBought = new db.Boughts({name: username, goods: good.name, price: price});
                            newBought.save();
                        }
                    }
                });
            } else console.log("nogoods:C");
        });
    };
    exports.wiskeyOn = function (username) {
        if(!wiskeyBuy){
        db.Users.findOne({name: username}, function (err, user) {
            user.cash = user.cash-5;
            user.save();
        });
            wiskeyBuy=true;
        }
        wiskey=true;
    };
};

//����� ����, ������ ���������--------------------------------
exports.end = function () {
    exports.wait = false;
    exports.endflag = true;
    exports.startflag = false;
    console.log("Game ended!--------------------------------------------------");
    exports.statistic=true;
    db.Boughts.find(function(err,boughts){
        exports.statData=boughts;
    });
};

//������s--------------------------------------------------------
function randGoods() {
    db.Goods.find(function (err, goods) {
        goodId = rand(0, goods.length - 1);
        db.Goods.findOne({goodid: goodId}, function (err, good) {
            goodName = good.name;
        });
    });
};
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};