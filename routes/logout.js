var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/", (req, res, next) => {
	console.log("ALERT: Logging out...");
	delete req.session.user;
	console.log(req.session.user);
	res.redirect('/');
});

module.exports = router;