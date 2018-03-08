var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session && req.session.loggedIn)
	{
		res.render('newgoal', {user : req.session});
	}
	else
	{
		res.redirect('/');
	}
});

router.post("/", (req, res, next) =>
{
	if ('goal' in req.body)
	{
		queries.writeGoal(req.session.username, req.body.duration, req.body.goal, req.body.reward, (success) =>
		{
			if (!success)
			{
				console.log("ALERT: Failed to submit new goal.");
				res.redirect('/newgoal');
			}
			else
			{
				res.redirect('/pastgoals');
			}
		});
	} else {
		res.redirect('/home');
	}
});

module.exports = router;
