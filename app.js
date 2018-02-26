const 	express = require('express');
		path = require('path');
		fs = require('fs');
		logger = require('morgan');
		cookieParser = require('cookie-parser');
		bodyParser = require('body-parser');

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
	Redis set-up:
*/
var		session = require('express-session');
		RedisStore = require('connect-redis')(session)
		url = require('url');

var currentENV = process.env.NODE_ENV;

if (currentENV === "development")
{
	console.log("ALERT: Redis launched in development.")

	app.use(session({ 		secret: "apassword",
                            store: new RedisStore({
								host: "localhost",
								port: 6379
							}),
							resave: false,
							saveUninitialized: false
					}));
}
else if (currentENV === "production")
{
	console.log("ALERT: Redis launched in production.")
	var redisURL   = require("url").parse(process.env.REDISTOGO_URL);
	var redisAuth = redisURL.auth.split(':');
	const DB_NUMBER = 0;
	app.use(session({ 		secret: "apassword",
                           	store: new RedisStore({
                           		host: redisURL.hostname,
                           		port: redisURL.port,
                           		db: DB_NUMBER,
                           		pass: redisAuth[1]
                           	}),
                           	resave: false,
							saveUninitialized: false
					}));
}
else
{
	console.log("ALERT: NODE_ENV is an invalid value.");
}

/*
	Postgres set-up and connection:
*/
var queries = require(path.join(__dirname + '/lib/queries'));
// Set up database if not done yet
queries.dbExists((response) => {
	if (!(response))
	{
		console.log("ALERT: First run; setting up tables in database.")
		queries.setup(path.join(__dirname + "/lib/sql/first_run.sql"));
	}
});

/*
	Declaration of routes:
*/

var index = require('./routes/index');
var signup = require('./routes/signup');
var home = require('./routes/home');
var journal = require('./routes/journal');
var logout = require('./routes/logout');
var history = require('./routes/history');
var mood = require('./routes/mood');

app.use('/', index);
app.use('/signup', signup);
app.use('/home', home);
app.use('/journal', journal);
app.use('/logout', logout);
app.use('/history', history);
app.use('/mood', mood);

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

module.exports = app;
