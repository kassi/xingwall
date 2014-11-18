if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require('dotenv').load();
}

var express  = require('express'),
    config   = require('./config/config'),
    glob     = require('glob'),
    mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./config/express')(app, config, io);

http.listen(config.port);
