var Profile = require('mongoose').model('Profile');

module.exports = function (app, io) {
  io.on('connection', function (socket) {
    socket.on('profiles:all', function () {
      Profile.find().exec()
        .then(function (profiles) {
          socket.emit('profiles:all', profiles);
        }, function (err) {
          console.error(err);
        });
    });
  });
};