var config   = require('../../config/config'),
    XINGApi  = require('xing-api'),
    mongoose = require('mongoose'),
    Profile  = mongoose.model('Profile'),
    Wall     = mongoose.model('Wall'),
    xingApi  = new XINGApi(config.xingApi);

module.exports = function (app, io) {
  app.get('/', function (req, res) {
    Wall.find().exec()
      .then(function (walls) {
        res.render('index', { walls: walls });
      }, function (err) {
        console.error(err);
      });
  });

  app.get('/connect', function (req, res) {
    xingApi.getRequestToken(function (oauthToken, oauthTokenSecret, authorizeUrl) {
      res.cookie('requestToken',
        JSON.stringify({ token: oauthToken, secret: oauthTokenSecret }),
        { signed: true });

      res.redirect(authorizeUrl);
    });
  });

  app.get('/oauth_callback', function (req, res) {
    var requestToken = JSON.parse(req.signedCookies.requestToken);

    xingApi.getAccessToken(requestToken.token, requestToken.secret, req.query.oauth_verifier,
      function (error, oauthToken, oauthTokenSecret) {
        res.cookie('requestToken', null); // delete cookie

        var client = xingApi.client(oauthToken, oauthTokenSecret);

        client.get('/v1/users/me', function (error, response) {
          var user = JSON.parse(response).users[0];

          var profile = new Profile({
            displayName: user.display_name,
            photoUrls: {
              size_64x64: user.photo_urls.size_64x64,
              size_256x256: user.photo_urls.size_256x256
            }
          }).toObject();

          delete profile._id;

          Profile.update({ _id: user.id }, profile, { upsert: true }).exec()
            .then(function () {
              io.emit('profiles:updated');

              res.render('oauth/callback');
            }, function (err) {
              console.error(err);
            });
        });
      });
  });
};
