var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join('../lib/queries'));
var rewards = require(path.join('../lib/rewards'));

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

router.post('/', (req, res, next) => {
  var uname = req.body.username;
  var pword = req.body.password;
  queries.validateLogin(uname,
    pword,
    (responseData) => {
      // to see the contents of responseData, check variable 'send' in lines 69-72 of queries.js
      // {loggedIn : false,
      // usernameExists : true,
      // username : "",
      // userID : 0
      // send.level = response[0].level;
      // send.logins = response[0].logins;
      // send.posts = response[0].posts;
      // send.goals = response[0].goals};
      if (responseData.loggedIn) {
        req.session.username = responseData.username;
        req.session.loggedIn = true;
        req.session.level = responseData.level;
        req.session.logins = responseData.logins + 1;
        // increment login
        req.session.posts = responseData.posts;
        req.session.goals = responseData.goals;
        res.redirect('/home');
        rewards.changeLevel(req.session.username, req.session.level, req.session.logins, req.session.posts, req.session.goals);
      } else {
        delete req.session;
        res.redirect('/?failedLogin=true');
      }
    });
});

module.exports = router;
