var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser")
var logger = require('morgan');
var db = require('./db');
const session = require('express-session')
const passport = require('passport')
var cors = require('cors')
const pino = require('express-pino-logger')();


////////////////////////
var chatOnline = require('./chatOnline')
var UserController = require('./controller/UserController');
var indexRouter = require('./controller/indexController');
var ComputerController = require('./controller/ComputerController');
var GroupController = require('./controller/GroupController');
var ImageController = require('./controller/ImageController');

// database connected
db.connect()

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use(bodyParser.urlencoded({
//   extended: true
// }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge : 1000000 } // timout
}))

app.use(passport.initialize())
app.use(passport.session())






/////////////////////////////////////////////////////////////////////////   ROUTES  ///////////////////////////////////////////////////////////
app.use('/', indexRouter)
app.use('/users', UserController)
app.use('/computers', ComputerController)
app.use('/groups', GroupController)
app.use('/image', ImageController)


///////////////////////////////////////////////////////////////////// catch 404 and forward to error handler   ////////////////////////////////////
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app
