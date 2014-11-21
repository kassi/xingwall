if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require('dotenv').load();
}

var app          = require('express')(),
    mongoose     = require('mongoose'),
    http         = require('http').Server(app),
    io           = require('socket.io')(http),
    events       = require('events'),
    eventEmitter = new events.EventEmitter();

mongoose.connect(process.env.MONGOHQ_URL);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + process.env.MONGOHQ_URL);
});

require('./config/express')(app, io);

var Session = mongoose.model('Session');

eventEmitter.on('tokenCheck', function () {
  // check every 5 minutes if the session is still active
  var cutoff = new Date(Date.now() - 5 * 60 * 1000);
  Session
    .find({ "session.lastActive": { $lt: cutoff } })
    .exec()
    .then(function (sessions) {
      var now = new Date();
      // TODO: check if the token is still active
      sessions.forEach(function (session) {
        session.session.lastActive = now;
        session.save(function (err) {
          if (err) {
            console.log('Failed to save session ', err);
          } else {
            console.log('Worker: Refreshed session ', session.id);
          }
        });
      });
    });
});

setInterval(function () {
  eventEmitter.emit('tokenCheck');
}, 5 * 60 * 1000);

http.listen(process.env.PORT || 3000);
