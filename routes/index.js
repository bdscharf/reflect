var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/',(req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

router.post('/', (req, res, next) => {
	console.log(req.body);
	// VALIDATE USER INPUT HERE
	res.redirect('/home');
});

module.exports = router;
