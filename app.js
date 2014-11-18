if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require('dotenv').load();
}

var app      = require('express')(),
    mongoose = require('mongoose'),
    http     = require('http').Server(app),
    io       = require('socket.io')(http);

mongoose.connect(process.env.MONGOHQ_URL);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + process.env.MONGOHQ_URL);
});

require('./config/express')(app, io);

http.listen(process.env.PORT || 3000);
