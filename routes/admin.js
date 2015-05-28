var express = require('express');
var router = express.Router();
var db = require('./lib/db');

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.Users.find(function (err, users) {
        res.render('admin', {userlist: users});
    });
});

module.exports = router;
