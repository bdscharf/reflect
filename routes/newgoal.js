var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));
var rewards = require(path.join('../lib/rewards'));


router.get("/", (req, res, next) => {
	if (req.session && req.session.loggedIn)
	{
		queries.getLevel(req.session.username, (ulevel) =>
		{
			req.session.level = ulevel;
			res.render('newgoal', {user : req.session, level: req.session.level});
		});
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
				req.session.achievementMessage = "New Goal +10xp";
				res.redirect('/pastgoals');
				req.session.goals ++;
				rewards.changeLevel(req.session.username, req.session.level, req.session.logins, req.session.posts, req.session.goals);
			}
		});
	} else {
		res.redirect('/home');
	}
});

module.exports = router;
