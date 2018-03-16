var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session && req.session.loggedIn)
	{
		queries.getJournal(req.session.username, (userData) =>
		{
			res.render('history', {
				user : req.session,
				posts : userData,
				achievementMessage: req.session.achievementMessage,
				displayed: function() {
					req.session.achievementMessage = "";
				}
			});
		});
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;
