var root = require('path').normalize(__dirname + '/..'),
    mongoose = require('mongoose'),
    glob = require('glob'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/xingwall-test');
var db = mongoose.connection;

var models = glob.sync(root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
