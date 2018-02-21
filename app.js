const 	express = require('express');
		path = require('path');
		fs = require('fs');
		logger = require('morgan');
		cookieParser = require('cookie-parser');
		bodyParser = require('body-parser');
		pg = require('pg');
		startupSQL = fs.readFileSync('./sql/first_run.sql').toString();

require('dotenv').load();
const app = express();

// Set default view engine
app.set('views', path.join(__dirname, '/routes/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
	Declaration of routes:
*/

var index = require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var home = require('./routes/home');
var journal = require('./routes/journal');

app.use('/', index);
app.use('/login', login);
app.use('/signup', signup);
app.use('/home', home);
app.use('/journal', journal);

/*
	Express error-catching set-up:
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

/*
	Postgres set-up and connection:
*/
var dbExists = require("./lib/db_admin_tools").dbExists;
var setup = require("./lib/db_admin_tools").setup;

// Set up database if not done yet
dbExists((response) => {
	if (!(response))
	{
		console.log("ALERT: First run; setting up tables in database.")
		setup(path.join(__dirname + "/sql/first_run.sql"));
	}
});

module.exports = app;
