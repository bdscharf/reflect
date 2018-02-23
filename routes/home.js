var express = require('express');
var router = express.Router();
var path = require('path');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM(path.join(__dirname + 'views/home.html'));

router.get("/", (req, res, next) => {
	if (req.session.user)
	{
		res.sendFile(path.join(__dirname + '/views/home.html'));
		//getElementById("welcome-back").innerHTML = "Welcome back, " + req.session.username;
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;
