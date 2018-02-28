var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session.username)
	{
		queries.getData(req.session.username, 'journalentry', (userData) =>
		{
			res.render('history', {
				user : req.session,
				posts : userData
			});
		});
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;

