var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
	if (req.session.loggedIn)
	{
		res.render('journal', {user : req.session});
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