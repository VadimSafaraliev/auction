var express = require('express');
var router = express.Router();
var db = require('./lib/db');
var game = require('./lib/game');
db.deleteBoughts();
db.deleteUsers();
var numberSessions;

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.username != undefined && req.session.uid != undefined) {
        db.Users.findOne({name: req.session.username}, function (err, user) {
            res.render('index', {
                usersoff: false,
                nameuser: req.session.username,
                cash: user.cash,
                wiskey: user.wiskey,
                end: game.endflag
            });

        });
    } else {
        db.deleteBoughts();
        db.deleteUsers();
        req.session.uid = undefined;
        req.session.username = undefined;
        res.render('index', {usersoff: true});
    }
});

router.get('/login', function (req, res, next) {
    req.session.username = req.query.username;
    req.session.uid = db.login(req.query.username) - 1;
    res.redirect('/');
});

router.get('/sync', function (req, res, next) {
    var price = game.price;
    var goodName = game.goodName;
    var numberSession = game.numberSessions;
    var wait = game.wait;
    var end = game.endflag;
    var statData = game.statData;
    var statistic;
    if (end) statistic = true;
    var start = game.startflag;
    db.Users.findOne({name: req.session.username}, function (err, user) {
        if (user) {
            db.Users.find(function (err, users) {
                res.jsonp({
                    price: price,
                    name: goodName,
                    username: req.session.username,
                    numberSession: numberSession,
                    score: user.score,
                    start: start,
                    end: end,
                    wait: wait,
                    statistic: statistic,
                    statData: statData,
                    usersArray: users
                });
            });

        }
        else
            res.jsonp({price: price, name: goodName, numberSession: numberSession, start: start, end: end, wait: wait});
    });
});

router.get('/buy', function (req, res, next) {
    game.buy(req.session.username);
    setTimeout(function () {
        res.redirect('/');
    }, 700);
});

router.get('/buywiskey', function (req, res, next) {
    game.wiskeyOn(req.session.username);
    res.redirect('/');
});

router.get('/start', function (req, res, next) {
    db.Users.find(function (err, users) {
        if (users.length < 2 || users.length > 7) res.redirect('/admin?error=users-number');
        else {
            numberSessions = Math.round(3 * users.length / 2);
            game.start(numberSessions);
            res.redirect('/admin');
        }
    });
});

module.exports = router;
