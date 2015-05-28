var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
//---------------------------------------------------------------------------
var Schema = mongoose.Schema;
var userSchema = new Schema({
    id: Number,
    name: String,
    cash: Number,
    score: Number,
    wiskey:Boolean
});
var goodsSchema = new Schema({
    goodid: Number,
    name: String
});
var boughtsSchema = new Schema({
    name: String,
    goods: String,
    price: Number
});
//---------------------------------------------------------------------------
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("connected to base");
});
//---------------------------------------------------------------------------
var Users = mongoose.model('Users', userSchema);
var Goods = mongoose.model('Goods', goodsSchema);
var Boughts = mongoose.model('Boughts', boughtsSchema);
//var newgood = new Goods({name:"Apple",goodid:4});
//newgood.save();
//vconsole.log(newgood);
//---------------------------------------------------------------------------
//Goods.remove({}, function (err,call) {
//});
//Goods.find(function (err,goods) {
//    console.log(goods);
//});
var userId = [];
exports.login = function (username) {
    var newUser = new Users({name: username, cash: 100, score: 0, id: userId.length,wiskey:true});
    userId.push(1);
    newUser.save();
    return userId.length;

};
exports.deleteUsers = function () {
    userId=[];
    Users.remove(function (err, docs) {
    });
};
exports.deleteBoughts = function () {
    Boughts.remove({}, function (err, docs) {
    });
};
exports.Users = Users;
exports.Goods = Goods;
exports.Boughts = Boughts;
