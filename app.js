var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use('/static', express.static('public'));
// connect to a database
// mongodb://<user>:<password>@<host>/<database>
mongoose.connect('mongodb+srv://asd52052:asd52052@cluster0.s714v.azure.mongodb.net/304cem', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){});

// use express-sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
app.use(express.static(__dirname + '/views'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});




// error handler, define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3200
app.listen(3000, function () {
  console.log('Listening on port 3000...');
});