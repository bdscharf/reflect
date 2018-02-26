var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/signup.html'));
});

router.post("/", (req, res, next) => {
	var data = {fullname : req.body.fullname,
				username : req.body.username,
				password : req.body.password};

	if (data.password.length < 6) {
		res.redirect('/signup?pLengthErr=true');
	}

	if (data.password === req.body.confirm)
	{
		queries.addUser(data, (success) => {
			if (success)
			{
				res.redirect('/');
			}
			else
			{
				console.log("ALERT: Failed to create user, username is probably already in use.");
				// do something else here to tell the user
				res.redirect('/signup?uniqueNameErr=true');
			}
		});
	}
	else
	{
		console.log("ALERT: Passwords do not match!");
		// do something else here to tell the user
		res.redirect('/signup?pMatchErr=true');
	}
});

module.exports = router;
