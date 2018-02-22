var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get('/',(req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

router.post('/', (req, res, next) => {
	var uname = req.body.username;
	var pword = req.body.password;
	queries.validateLogin(	uname, 
							pword,
							(responseData) =>
							{
								if (responseData.loggedIn)
								{
									res.redirect('/home');
								}
								else
								{
									res.redirect('/');
								}
							});
});

module.exports = router;
