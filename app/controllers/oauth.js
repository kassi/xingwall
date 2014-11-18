var XINGApi  = require('xing-api'),
    mongoose = require('mongoose'),
    Wall     = mongoose.model('Wall'),
    xingApi  = new XINGApi({
      consumerKey: process.env.XING_CONSUMER_KEY,
      consumerSecret: process.env.XING_CONSUMER_SECRET,
      oauthCallback: process.env.OAUTH_CALLBACK
    });

module.exports = function (app, io) {
  app.get('/', function (req, res) {
    Wall.find().exec()
      .then(function (walls) {
        res.render('index', { walls: walls });
      }, function (err) {
        console.error(err);
      });
  });

  app.get('/connect/:wall_id', function (req, res) {
    // XXX ugly hack
    var existingAuthorizeCallback = xingApi.oauth._authorize_callback;
    xingApi.oauth._authorize_callback = existingAuthorizeCallback + '?wall_id=' + req.params.wall_id;

    xingApi.getRequestToken(function (oauthToken, oauthTokenSecret, authorizeUrl) {
      res.cookie('requestToken',
        JSON.stringify({ token: oauthToken, secret: oauthTokenSecret }),
        { signed: true });

      res.redirect(authorizeUrl);
    });

    // XXX ugly hack
    xingApi.oauth._authorize_callback = existingAuthorizeCallback;
  });

  app.get('/oauth_callback', function (req, res) {
    var requestToken = JSON.parse(req.signedCookies.requestToken);

    xingApi.getAccessToken(requestToken.token, requestToken.secret, req.query.oauth_verifier,
      function (error, oauthToken, oauthTokenSecret) {
        res.cookie('requestToken', null); // delete cookie

        var client = xingApi.client(oauthToken, oauthTokenSecret);

        client.get('/v1/users/me', function (error, response) {
          var user = JSON.parse(response).users[0];

          Wall.findOne({ _id: req.query.wall_id }).exec()
            .then(function (wall) {
              // remove use if already there
              wall.profiles.pull({_id: user.id });

              wall.profiles.push({
                _id: user.id,
                displayName: user.display_name,
                photoUrls: {
                  size_64x64: user.photo_urls.size_64x64,
                  size_256x256: user.photo_urls.size_256x256
                }
              });
              wall.save(function (err) {
                if(err) {
                  console.error(err);
                } else {
                  io.emit('profiles:updated');
                  res.render('oauth/callback');
                }
              });
            });
        });
      });
  });
};
