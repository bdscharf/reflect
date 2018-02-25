var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session.user)
	{
		res.sendFile(path.join(__dirname + '/views/history.html'));
		queries.getData(req.session.username, 'journalentry', (userData) =>
		{
			if (userData)
			{
				console.log(userData);
			}
			else
			{
				console.log("ALERT: No user data, or failure within database...")
			}
		});
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;

