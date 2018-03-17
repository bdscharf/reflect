var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));
var rewards = require(path.join('../lib/rewards'));

router.get("/", (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    queries.getLevel(req.session.username, (ulevel) =>
    {
      req.session.level = ulevel;
      res.render('journal', {
        user: req.session,
        level: req.session.level
      });
    });
  } else {
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
  if ("feeling" in req.body) {
    var dtype = "journalentry";
    queries.writeData(req.session.username, dtype, req.body, (success) => {
      if (!success) {
        console.log("ALERT: Failed to write new journal entry.");
        res.redirect('/journal');
      } else {
        req.session.achievementMessage = "Journal Entry +10xp";
        res.redirect('/history');
        req.session.posts++;
        rewards.changeLevel(req.session.username, req.session.level, req.session.logins, req.session.posts, req.session.goals);
      }
    });
  } else {
    res.redirect('/journal/?uncheckedFeelings=true')
  }
});

module.exports = router;
