if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require('dotenv').load();
}

var app      = require('express')(),
    config   = require('./config/config'),
    mongoose = require('mongoose'),
    http     = require('http').Server(app),
    io       = require('socket.io')(http);

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

require('./config/express')(app, config, io);

http.listen(config.port);
