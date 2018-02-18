var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/signup.html'));
});

router.post("/", (req, res, next) => {
	res.redirect('/login');
});

module.exports = router;
