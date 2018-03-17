var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));
var rewards = require(path.join('../lib/rewards'));

router.get("/", (req, res, next) => {
	// user log-in check
	if (req.session && req.session.loggedIn)
	{
		queries.getLevel(req.session.username, (ulevel) =>
		{
			req.session.level = ulevel;
			// check if goal has been moved
			if (req.query.ts && req.query.status)
			{
				queries.updateGoal(req.session.username, req.query.ts, req.query.status, (success) =>
				{
					if (!success)
					{
						console.log("ALERT: Failed to update goal status.");
					}
					res.redirect('/pastgoals');
					req.session.goals ++;
					// redirect after db adjustment to have page rendered
				});
			}
			else // if goal hasn't just been moved, render page
			{
				queries.getGoals(req.session.username, (goals) => {
					res.render('pastgoals', {
						user : req.session,
						level: req.session.level,
						goals: goals,
						achievementMessage: req.session.achievementMessage,
						displayed: function() {
							req.session.achievementMessage = "";
						}
					});
				});
			}
			rewards.changeLevel(req.session.username, req.session.level, req.session.logins, req.session.posts, req.session.goals);
		});
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;
