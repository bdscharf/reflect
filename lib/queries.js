var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var dateFormat = require('dateformat');
const HASH_ROUNDS = 10;
require('dotenv').load();

function prepSQL(query)
{
	var updated = query.replace(/{SCHEMA}/g, process.env.SCHEMA);
	return updated;
}

const initOptions = {};
const pgp = require('pg-promise')(initOptions);
const db = pgp(process.env.DATABASE_URL);

var dbExists = (callback) => {
	var sql = "SELECT to_regclass('{SCHEMA}.users');"

	db.any(prepSQL(sql))
	.then((response) => {
		var exists = Boolean(response[0].to_regclass);
		return callback(exists);
	})
	.catch((error) => {
		console.log(error);
	});
}

exports.dbExists = dbExists;

var setup = (apath) => {
	var sql = fs.readFileSync(apath).toString();

	db.none(prepSQL(sql))
    .catch((error) => {
        console.log(error);
    });
}

exports.setup = setup;

/*
	User management:
*/

var addUser = (userData, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/create_new_user.sql')).toString();

	bcrypt.hash(userData.password, HASH_ROUNDS, (err, hash) => {
		if (err) { console.log("ALERT: Hashing error."); }
		else
		{
			db.none(prepSQL(sql), [userData.fullname, userData.username, hash, userData.level, userData.logins, userData.posts, userData.goals])
			.then(() =>
			{
				callback(true);
			})
			.catch((error) =>
			{
				console.log(error);
				callback(false);
			});
		}
	});
}

exports.addUser = addUser;

var validateLogin = (uname, pword, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/retrieve_user.sql')).toString();
	var update = fs.readFileSync(path.join(__dirname + '/sql/update_login.sql')).toString();

	db.any(prepSQL(sql), [uname])
	.then((response) => {
		var send = {loggedIn : false,
					usernameExists : true,
					username : "",
					userID : 0};
		if (response !== undefined && response.length != 0)
		{
			send.usernameExists = true;
			bcrypt.compare(pword, response[0].password, (err, comp) =>
			{
				if (err) { console.log(err); }
				else
				{
					if (comp) // passwords match, success!
					{
						db.none(prepSQL(update), [uname])
						.catch((err) => { console.log("ALERT: Failed to update last_login."); });
						send.loggedIn = true;
						send.username = uname;
						send.userID = response[0].user_id;
						send.level = response[0].level;
						send.logins = response[0].logins;
						send.posts = response[0].posts;
						send.goals = response[0].goals;
						console.log("ALERT: Login successful.");
						return callback(send);
					}
					else // passwords do not match!
					{
						console.log("ALERT: Passwords do not match.");
						return callback(send);
					}
				}
			});
		}
		else
		{
			console.log("ALERT: Username does not exist in database.");
			send.usernameExists = false;
			return callback(send);
		}
	})
	.catch((error) => { console.log(error) });

	// retrieve password from database, compare passwords using bcrypt, send back true or false
}

exports.validateLogin = validateLogin;

/*
	Handling of journaling:
*/

var writeData = (uname, dtype, data, callback) =>
{
	var jdata = JSON.stringify(data);
	var sql = fs.readFileSync(path.join(__dirname + '/sql/new_entry.sql')).toString();

	db.none(prepSQL(sql), [uname, dtype, jdata])
	.catch((error) => {
		console.log(error);
		return callback(false);
	});
	return callback(true);
}

exports.writeData = writeData;

var getJournal = (uname, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/pull_data.sql')).toString();

	db.any(prepSQL(sql), [uname, "journalentry"])
	.then((responses) =>
	{
		var posts = [];

		for (var i = 0; i < responses.length; i ++)
		{
			var dateObj = new Date(responses[i].created_at);
			var cleanDate = dateFormat(dateObj, "dddd, mmmm dS, yyyy, h:MM TT");
			var feeling_str = "";

			if ("feeling" in responses[i].data)
			{
				if (responses[i].data.feeling instanceof Array)
				{
					for (var j = 0; j < responses[i].data.feeling.length; j ++)
					{
						if (j == 0)
						{
							feeling_str += responses[i].data.feeling[j];
						}
						else
						{
							feeling_str += ", " + responses[i].data.feeling[j];
						}
					}
				}
				else
				{
					feeling_str = responses[i].data.feeling;
				}
			}

			var post =
			{
				createdAt: cleanDate,
				feelings: feeling_str,
				standsOut: responses[i].data.standout,
				better: responses[i].data.whatbetter,
				whyFeel: responses[i].data.whyfeeling,
				firstThought: responses[i].data.firstthoughts
			};
			posts.push(post);
		}
		return callback(posts);
	})
	.catch((error) => { console.log(error); return callback(false); });
}

exports.getJournal = getJournal;

var getMood = (uname, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/pull_data.sql')).toString();

	db.any(prepSQL(sql), [uname, "mood"])
	.then((responses) =>
	{
		var posts = [];

		for (var i = 0; i < responses.length; i ++)
		{
			var dateObj = new Date(responses[i].created_at);
			var cleanDate = dateFormat(dateObj, "dddd, mmmm dS, yyyy, h:MM TT");
			if (Object.keys(responses[i].data).length === 0 && responses[i].data.constructor === Object) {
				continue;
			}

			var post =
			{
				createdAt: cleanDate,
				today: responses[i].data.today,
				hours: responses[i].data.hours,
				diet: responses[i].data.diet,
				exercise: responses[i].data.exercise,
				leisure: responses[i].data.leisure
			};
			posts.push(post);
		}

		return callback(posts);
	})
	.catch((error) => { console.log(error); return callback(false); });
}

exports.getMood = getMood;


/*
	Handling of goals:
*/

// (username, created_at, duration, in_progress, goal)
var writeGoal = (uname, duration, goal, reward, callback) =>
{
	var in_progress = true;
	var sql = fs.readFileSync(path.join(__dirname + '/sql/new_goal.sql')).toString();
	var ts = Math.round((new Date()).getTime() / 1000);

	db.none(prepSQL(sql), [uname, ts, duration, in_progress, goal, reward])
	.catch((error) => {
		console.log(error);
		return callback(false);
	});
	return callback(true);
}

exports.writeGoal = writeGoal;

var updateGoal = (uname, created_at, status, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/update_goal_status.sql')).toString();
	var inProgress = false;

	if(status === "in-progress")
	{
		inProgress = true;
	}

	db.none(prepSQL(sql), [inProgress, uname, created_at])
	.catch((error) => {
		console.log(error);
		return callback(false);
	});
	return callback(true);
}

exports.updateGoal = updateGoal;

var getGoals = (uname, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/retrieve_goals.sql')).toString();

	db.any(prepSQL(sql), [uname])
	.then((responses) =>
	{
		var goals = [];

		for (var i = 0; i < responses.length; i ++)
		{
			var dateObj = new Date(responses[i].created_at * 1000);
			// unix timestamp must be multiplied by 1000
			var cleanDate = dateFormat(dateObj, "dd/mm/yyyy, h:MM TT");

			var goal =
			{
				createdAt: cleanDate,
				goal: responses[i].goal,
				in_progress: responses[i].in_progress,
				duration: responses[i].duration,
				timestamp: responses[i].created_at,
				reward: responses[i].reward
			};
			goals.push(goal);
		}
		return callback(goals);
	})
	.catch((error) => {
		console.log(error);
		return callback(false);
	});
}

exports.getGoals = getGoals;

/*
	Handling of rewards:
*/
var updateLevel = (uname, lvl, logins, posts, goals, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/update_level.sql')).toString();

	db.none(prepSQL(sql), [lvl, logins, posts, goals, uname])
	.catch((error) => {
		console.log(error);
		return false;
	});
	return true;
}

exports.updateLevel = updateLevel;

var getUserData = (uname, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/retrieve_user.sql')).toString();

	db.any(prepSQL(sql), [uname])
	.then((response) =>
	{
		var send = {};
		send.level = response[0].level;
		send.logins = response[0].logins;
		send.posts = response[0].posts;
		send.goals = response[0].goals;
		return callback(send);
	})
	.catch((error) =>
	{
		console.log(error);
		return callback(false);
	});
}

exports.getUserData = getUserData;

var getLevel = (uname, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/get_level.sql')).toString();

	db.any(prepSQL(sql), [uname])
	.then((response) =>
	{
		return callback(response[0].level);
	})
	.catch((error) =>
	{
		console.log(error);
		return callback(false);
	});
}

exports.getLevel = getLevel;
