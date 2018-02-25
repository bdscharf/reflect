var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session.loggedIn)
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
