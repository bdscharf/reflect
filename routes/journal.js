var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session.loggedIn)
	{
		res.sendFile(path.join(__dirname + '/views/journal.html'));
	}
	else
	{
		res.redirect('/');
	}
});

router.post("/", (req, res, next) => {
// form resembling:
//		 { 	feeling: [ 'Anxious', 'Motivated' ],
//  		firstthoughts: '',
//  		whyfeeling: '',
//  		whatbetter: '',
//  		standout: '' }
	console.log(req.body);
	var dtype = "journalentry";
	queries.writeData(req.session.username, dtype, req.body, (success) =>
	{
		console.log(success);
		if (!success)
		{
			console.log("ALERT: Failed to write new journal entry.");
			res.redirect('/journal');
		}
		else
		{
			res.redirect('/history');
		}
	});
});

module.exports = router;