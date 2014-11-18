var Profile = require('mongoose').model('Profile');

module.exports = function (app, io) {

  io.on('connection', function (socket) {
    socket.on('profiles:all', function() {
      Profile.find({}, function (err, profiles) {
        socket.emit('profiles:all', profiles);
      });
    })
  });
};