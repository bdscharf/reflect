var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session && req.session.loggedIn)
	{
		queries.getGoals(req.session.username, (goals) => {
			res.render('pastgoals', {
				user : req.session,
				goals: goals
			});
		});
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;
