if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require('dotenv').load();
}

var app      = require('express')(),
    mongoose = require('mongoose'),
    http     = require('http').Server(app),
    io       = require('socket.io')(http),
    events   = require('events'),
    XINGApi  = require('xing-api'),
    xingApi  = new XINGApi({
      consumerKey:    process.env.XING_CONSUMER_KEY,
      consumerSecret: process.env.XING_CONSUMER_SECRET,
      oauthCallback:  process.env.OAUTH_CALLBACK
    });

mongoose.connect(process.env.MONGOHQ_URL);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + process.env.MONGOHQ_URL);
});

var eventEmitter = new events.EventEmitter();

require('./config/express')(app, io, eventEmitter, xingApi);

var seconds = 1000;
var minutes = 60 * seconds;

setInterval(function () {
  eventEmitter.emit('tokenCheck');
}, 1 * minutes);

http.listen(process.env.PORT || 3000);
