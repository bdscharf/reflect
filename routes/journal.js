var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/journal.html'));
});

// Implement once account_tools.js and user_data.js are complete
//router.post("/", (req, res, next) => {
//	res.redirect('/home');
//});

module.exports = router;