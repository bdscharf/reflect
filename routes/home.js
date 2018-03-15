var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session && req.session.loggedIn)
	{
		res.render('home', {user : req.session, level: req.session.level});
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;
