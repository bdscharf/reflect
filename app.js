const 	express = require('express');
		path = require('path');
		fs = require('fs');
		logger = require('morgan');
		cookieParser = require('cookie-parser');
		bodyParser = require('body-parser');
		
// redis requirements
var		session = require('express-session');
		RedisStore = require('connect-redis')(session)
		url = require('url');

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
var signup = require('./routes/signup');
var home = require('./routes/home');
var journal = require('./routes/journal');

app.use('/', index);
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
	Redis set-up:
	read more here:
	http://blog.benhall.me.uk/2012/01/using-redis-and-redistogo-to-store-node-js-sessions-on-heroku/)
	and
	here:
	https://devcenter.heroku.com/articles/redistogo#using-with-node-js
*/

var currentENV = process.env.NODE_ENV;

if (currentENV === "development")
{
	app.use(session({ 		secret: "apassword", 
                            store: new RedisStore({
								host: "localhost",
								port: 6379,
							}),
							resave: true,
							saveUninitialized: false  
					}));
}
else if (currentENV === "production")
{
	var redisUrl = url.parse(process.env.REDISTOGO_URL);
	var redisAuth = redisUrl.auth.split(':');
	
	app.use(session({ 		secret: "apassword", 
                           	store: new RedisStore({
                           		host: redisUrl.hostname,
                           		port: redisUrl.port,
                           		db: redisAuth[0],
                           		pass: redisAuth[1],
                           	}),
                           	resave: true,
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
