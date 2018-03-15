var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));
var rewards = require(path.join('../lib/rewards'));


router.get("/", (req, res, next) => {
	if (req.session && req.session.loggedIn)
	{
		res.render('mood', {user : req.session});
	}
	else
	{
		res.redirect('/');
	}
});

router.post("/", (req, res, next) =>
{
	var dtype = "mood";
	queries.writeData(req.session.username, dtype, req.body, (success) =>
	{
		if (!success)
		{
			console.log("ALERT: Failed to write new journal entry.");
			res.redirect('/mood');
		}
		else
		{
			res.redirect('/history');
			req.session.posts ++;
			rewards.changeLevel(req.session.username, req.session.level, req.session.logins, req.session.posts, req.session.goals);	
		}
	});
});

module.exports = router;