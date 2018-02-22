var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/", (req, res, next) => {
	// route /home/logout
	req.session.user = {};
	res.redirect('/');
});

module.exports = router;