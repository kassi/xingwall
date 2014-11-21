var XINGApi  = require('xing-api'),
    mongoose = require('mongoose'),
    Wall     = mongoose.model('Wall'),
    Profile  = mongoose.model('Profile'),
    Session  = mongoose.model('Session'),
    xingApi  = new XINGApi({
      consumerKey:    process.env.XING_CONSUMER_KEY,
      consumerSecret: process.env.XING_CONSUMER_SECRET,
      oauthCallback:  process.env.OAUTH_CALLBACK
    });

module.exports = function (app, io, eventEmitter) {
  app.get('/walls/:wall_id/connect', function (req, res) {
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

  app.get('/walls/:wall_id/disconnect', function (req, res) {
    Profile
      .remove({ _id: req.session.user.id })
      .exec()
      .then(function (succ) {
        io.emit('profiles:updated', null);
      }, function (err) {
        console.log('Failed to remove profile', err);
      });

    req.session.user = null;

    res.render('oauth/logout', { url: "/walls/" + req.params.wall_id + "/connect" });
  });

  app.get('/oauth_callback', function (req, res) {
    if (!req.signedCookies.requestToken) {
      return res.redirect("/");
    }

    var requestToken = JSON.parse(req.signedCookies.requestToken);

    xingApi.getAccessToken(requestToken.token, requestToken.secret, req.query.oauth_verifier,
      function (error, oauthToken, oauthTokenSecret) {
        res.cookie('requestToken', null); // delete cookie

        if (error) {
          res.render('error');
          return;
        }

        req.session.regenerate(function (err) {
          req.session.user = {
            oauthToken: oauthToken,
            oauthTokenSecret: oauthTokenSecret
          }
          req.session.save();

          // The updateProfile event needs to have a mongoose instance of the session.
          // `req.session` is not the same.
          Session.findOne({_id: req.sessionID}).exec()
            .then(function (session) {
              eventEmitter.emit('updateProfile', session, req.query.wall_id);
            });

          res.render('oauth/callback', { url: "/walls/" + req.query.wall_id, wall_id: req.query.wall_id });
        });
      });
  });
};
