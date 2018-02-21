var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcrypt');

// where userData = {username:xxx, password:yyy}
var validateLogin = (userData, callback) =>
{
	// retrieve password from database, compare passwords using bcrypt, send back true or false
	var loggedIn = true;

	return callback(loggedIn)
}

exports.validateLogin = validateLogin;