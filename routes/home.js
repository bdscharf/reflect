var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session && req.session.loggedIn)
	{
		queries.getLevel(req.session.username, (ulevel) =>
		{
			req.session.level = ulevel;
			res.render('home', {
				user : req.session,
				level: req.session.level,
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
