var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

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

var setup = (path) => {
	var sql = fs.readFileSync(path).toString();

	db.none(sql)
    .catch((error) => {
        console.log(error);
    });
}

exports.setup = setup;

