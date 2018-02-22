var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/", (req, res, next) => {
	if (req.session.username)
	{
		res.sendFile(path.join(__dirname + '/views/home.html'));
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;
