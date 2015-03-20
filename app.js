"use strict";

var express = require('express');
var path = require('path'); // ?
var logger = require('morgan'); // Logger
var cookieParser = require('cookie-parser'); // Read/Write cookies
var bodyParser = require('body-parser'); // Parse Requests
var mongoose = require('mongoose'); // Db

var dbConfig = require('./utilities/db_config'); // Db Config
var expressSession = require('express-session'); // Sessions 
var flash = require('connect-flash'); // Flash messages
var passport = require('passport'); // Authentification, Passeport Pleaz


//var UserModel = require('./models/user');

// Setting up db
mongoose.connect(dbConfig.url);


/******************************
 *  Setting up express app
 ******************************/
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


/******************************
 * Setting up middleware
 ******************************/
// Logs any request
app.use(logger('dev'));

// Parse the body/heady of any requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Parse the cookies of any request
app.cookieParser = cookieParser();
app.use(app.cookieParser);

// All accessible files will be from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
app.use(flash());

// Our Session Middleware with memoryStore by default
// The seesion install as middleware of express app
app.sessionStore = expressSession({
    secret: 'n,dgEREZREZRZY4YAUlompl,mdazp;cs,qoqcdsmlùlcmoqs',
    proxy: true,
    resave: true,
    saveUninitialized: true
});

app.use(app.sessionStore);

// Configure passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport User Serialization
var initPassport = require('./passport/init');
initPassport(passport);
// Setting up Passport Strategies for Login
var localPassport = require('./passport/local/login');
localPassport(passport);

var googlePassport = require('./passport/googleplus/login');
googlePassport(passport);

var facebookPasseport = require('./passport/facebook/login');
facebookPasseport(passport);

// Setting up Passport Strategies for SignUp/Registration
var signupLocalPassport = require('./passport/local/signup');
signupLocalPassport(passport);

app.passport = passport;


/***************************
 * Routes
 ***************************/

var routes = require('./routes/index')(passport);

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
