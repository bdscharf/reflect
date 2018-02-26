var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcrypt');
const HASH_ROUNDS = 10;
require('dotenv').load();

const initOptions = {};
const pgp = require('pg-promise')(initOptions);
const db = pgp(process.env.DATABASE_URL);

var dbExists = (callback) => {
	var sql = "SELECT to_regclass('mm_dev.users');"

	db.any(sql)
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

	db.none(sql)
    .catch((error) => {
        console.log(error);
    });
}

exports.setup = setup;

var addUser = (userData, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/create_new_user.sql')).toString();

	bcrypt.hash(userData.password, HASH_ROUNDS, (err, hash) => {
		if (err) { console.log("ALERT: Hashing error."); }
		else 
		{
			db.none(sql, [userData.fullname, userData.username, hash])
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
	
	db.any(sql, [uname])
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
						db.none(update, [uname])
						.catch((err) => { console.log("ALERT: Failed to update last_login."); });
						send.loggedIn = true;
						send.username = uname;
						send.userID = response[0].user_id;
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

var writeData = (uname, dtype, data, callback) =>
{
	var jdata = JSON.stringify(data);
	var sql = fs.readFileSync(path.join(__dirname + '/sql/new_entry.sql')).toString();

	db.none(sql, [uname, dtype, jdata])
	.catch((error) => { 
		console.log(error);
		return callback(false);
	});
	return callback(true);
}

exports.writeData = writeData;

var getData = (uname, type, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/pull_data.sql')).toString();

	db.any(sql, [uname, type])
	.then((response) =>
	{
		var posts = [];
		// objects of format {postDate : date, type : string, contents : jsonblob}
		for (var i = 0; i < response.length; i ++)
		{
			var aPost =
			{
				createdAt : response.created_at,
				type : response.type,
				data : response.data
			};
			posts.push(aPost);
		}
		return callback(response);
	})
	.catch((error) => {});
	return callback(false);
}
	
exports.getData = getData;