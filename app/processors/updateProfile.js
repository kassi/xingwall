var mongoose = require('mongoose'),
    Session  = mongoose.model('Session'),
    Profile  = mongoose.model('Profile'),
    Wall     = mongoose.model('Wall');

module.exports = function (io, eventEmitter) {
  var handleError = function (sess, error) {
    if (error.code == 'ECONNRESET') {
      return; // ignore socket hang up error
    } else if (error.data) {
      var response = JSON.parse(error.data);

      if (error.statusCode === 401 && response.error_name === 'INVALID_OAUTH_TOKEN') {
        console.log('updateProfile: Session '+sess._id+' is expired. Removing ..');
        Profile.remove({_id: sess.session.user.id}).exec()
          .then(function () {
            io.emit('profiles:updated');
          }, function (err) {
            console.log('could not remove profile', err);
          });
        sess.remove(function (err) {
          if (err) {
            console.log('could not remove session', err);
          }
        });
      } else if (error.statusCode === 403 && response.error_name === 'RATE_LIMIT_EXCEEDED') {
        console.log("Warning: The consumer key is currently throttled", error);
      }
    }

    console.log('Unknown API error', error);
  }

  eventEmitter.on('updateProfile', function (sess, wall_id) {
    var client = xingApi.client(sess.session.user.oauthToken, sess.session.user.oauthTokenSecret);
    var fields = 'display_name,wants,haves,web_profiles,photo_urls.size_128x128,photo_urls.size_256x256';
    client.get('/v1/users/me?fields='+fields, function (error, response) {
      if (error) { return handleError(sess, error); }

      var user = JSON.parse(response).users[0];

      var profile = new Profile({
        userId: user.id,
          displayName: user.display_name,
          wants: user.wants,
          haves: user.haves,
          webProfiles: user.web_profiles,
          photoUrls: {
            size_128x128: user.photo_urls.size_128x128,
            size_256x256: user.photo_urls.size_256x256
          }
      }).toObject();

      delete profile._id; // make sure that we don't overwrite the internal _id on an update

      Profile.findOneAndUpdate({ userId: user.id }, profile, { upsert: true }).exec()
        .then(function (profile) {
          // put profile on the wall if required
          if (wall_id) {
            Wall.findOne({ _id: wall_id }).exec()
              .then(function (wall) {
                wall.profiles.pull(profile._id);
                wall.profiles.push(profile._id);
                wall.save(function (err) {
                  if (err) {
                    console.error(err);
                  }
                  io.emit('profiles:updated', profile);
                });
              }, function (err) {
                console.log(err);
              });
          }

          sess.session.user.id = profile._id;
          sess.session.lastActive = new Date();

          sess.save(function (err) {
            if (err) {
              console.log('Worker: Failed to save session ', err);
            } else {
              console.log('Worker: Refreshed session ', sess._id);
            }
          });
        });
    });
  });
}
