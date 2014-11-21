var Wall = require('mongoose').model('Wall');

module.exports = function (app, io) {
  io.on('connection', function (socket) {
    socket.on('profiles:all', function (opts) {
      Wall.findOne({ _id: opts.wallId })
        .populate('profiles')
        .exec()
        .then(function (wall) {
          socket.emit('profiles:all', wall.profiles);
        }, function (err) {
          console.error(err);
        });
    });
  });
};
