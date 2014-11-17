var express = require('express'),
    config  = require('../../config/config'),
    XINGApi = require('xing-api'),
    xingApi = new XINGApi(config.xingApi),
    router  = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index');
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
      var client = xingApi.client(oauthToken, oauthTokenSecret);

      client.get('/v1/users/me', function (error, response) {
        res.render('oauth_callback', { users: response });
      });
    });
});