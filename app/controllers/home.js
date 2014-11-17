var express = require('express'),
    config  = require('../../config/config'),
    XINGApi = require('xing-api'),
    Profile = require('mongoose').model('Profile'),
    xingApi = new XINGApi(config.xingApi),
    router  = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Profile.find(function (err, profiles) {
    if(err) { console.err(err); }
    res.render('index', { profiles: profiles });
  });
});

router.get('/connect', function (req, res, next) {
  xingApi.getRequestToken(function (oauthToken, oauthTokenSecret, authorizeUrl) {
    res.cookie('requestToken',
      JSON.stringify({ token: oauthToken, secret: oauthTokenSecret }),
      { signed: true });

    res.redirect(authorizeUrl);
  });
});

router.get('/oauth_callback', function (req, res, next) {
  var requestToken = JSON.parse(req.signedCookies.requestToken);

  xingApi.getAccessToken(requestToken.token, requestToken.secret, req.query.oauth_verifier,
    function (error, oauthToken, oauthTokenSecret) {
      res.cookie('requestToken', null, { signed: true }); // delete cookie

      var client = xingApi.client(oauthToken, oauthTokenSecret);

      client.get('/v1/users/me', function (error, response) {
        var user = JSON.parse(response).users[0];

        var profileData = {
          displayName: user.display_name,
          photoUrls: {
            size_64x64: user.photo_urls.size_64x64,
            size_256x256: user.photo_urls.size_256x256
          }
        };

        var profile = new Profile(profileData);

        profile.save(function (err) {
          if (err) {
            console.error(err);
          }

          res.redirect('/');
        });
      });
    });
});