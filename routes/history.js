var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));

router.get("/", (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    queries.getMood(req.session.username, (moodData) => {
      queries.getJournal(req.session.username, (journalData) => {
        res.render('history', {
          user: req.session,
					level: req.session.level,
          journalPosts: journalData,
          moodPosts: moodData,
          achievementMessage: req.session.achievementMessage,
          displayed: function() {
            req.session.achievementMessage = "";
          }
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
