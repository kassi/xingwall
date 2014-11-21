var mongoose = require('mongoose'),
    Session  = mongoose.model('Session');

module.exports = function (io, eventEmitter) {
  eventEmitter.on('tokenCheck', function () {
    // check only sessions that where check more than 5 minutes ago
    var cutoff = new Date(Date.now() - 5 * 60 * 1000);

    Session.find({ "session.lastActive": { $lt: cutoff } })
      .limit(100) // try to stay in the XING API throttling limit
      .exec()
      .then(function (sessions) {
        sessions.forEach(function (session) {
          eventEmitter.emit('updateProfile', session);
        });
      });
  });
}
