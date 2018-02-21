var express = require('express');
var router = express.Router();
var path = require('path');
var validateLogin = require('../lib/account_tools.js').validateLogin;

router.get('/',(req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

router.post('/', (req, res, next) => {
	var uname = req.body.username;
	var pword = req.body.password;
	validateLogin({	"username": uname,
					"password": pword}, 
					(callback) =>
					{
						console.log(callback);
					})
	res.redirect('/home');
});

module.exports = router;
