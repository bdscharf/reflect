var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session.username)
	{
		res.render('history');
		queries.getData(req.session.username, 'journalentry', (userData) =>
		{
			if (userData)
			{
				console.log(userData);
			}
			else
			{
				console.log("ALERT: No user data retrieved.")
			}
		});
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;

