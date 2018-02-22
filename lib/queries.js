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
				callback(false);
			});		
		}
	});
}

exports.addUser = addUser;

// where userData = {username:xxx, password:yyy}
var validateLogin = (userData, callback) =>
{
	var sql = fs.readFileSync(path.join(__dirname + '/sql/retrieve_user.sql')).toString();
	db.any(sql, [userData.username])
	.then((response) => {
		console.log(response);
	})
	.catch((error) => { console.log(error) });

	// retrieve password from database, compare passwords using bcrypt, send back true or false
	var loggedIn = true;

	return callback(loggedIn)
}

exports.validateLogin = validateLogin;