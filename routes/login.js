var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/login.html'));
});

router.post("/", (req, res, next) => {
	console.log(res.items);
});

module.exports = router;
