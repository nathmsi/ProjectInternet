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
var http =  require('http')
var io =  require('socket.io')
const pino = require('express-pino-logger')();


////////////////////////
var UserController = require('./controller/UserController');
var indexRouter = require('./controller/indexController');
var ComputerController = require('./controller/ComputerController');


// database connected
db.connect()

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const server = http.createServer(app);
const socketIo = io(server);


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
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())






/////////////////////////////////////////////////////////////////////////   ROUTES  ///////////////////////////////////////////////////////////
app.use('/', indexRouter)
app.use('/users', UserController)
app.use('/computers', ComputerController)


/////////////////////////////////////////////////////////////////////////   Socket.io /////////////////////////////////////////////////////////

// Start listening
server.listen(process.env.PORT || '5555');
// Setup socket.io
socketIo.on('connection', socket => {
  const username = socket.handshake.query.username;
  console.log(`${username} connected`);
  socket.broadcast.emit('server:connection', username);
  socket.on('client:message', data => {
    // console.log(`${data.username} : ${data.message}`);
    // message received from client, now broadcast it to everyone else
    socket.broadcast.emit('server:message', data);
  });
  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
    socket.broadcast.emit('server:disconnect', username);
  });
  
});



///////////////////////////////////////////////////////////////////// catch 404 and forward to error handler   ////////////////////////////////////
app.use(function(req, res, next) {
  next(createError(404));
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




module.exports = app
