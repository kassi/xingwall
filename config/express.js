var express        = require('express'),
    glob           = require('glob'),
    favicon        = require('serve-favicon'),
    logger         = require('morgan'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    compress       = require('compression'),
    methodOverride = require('method-override'),
    mongoose       = require('mongoose'),
    root           = require('path').normalize(__dirname + '/..'),
    session        = require('express-session'),
    MongoStore     = require('connect-mongo')(session);


module.exports = function (app, io) {
  app.set('views', root + '/app/views');
  app.set('view engine', 'jade');

  //app.use(favicon(root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(compress());
  app.use(express.static(root + '/public'));
  app.use(methodOverride());

  app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongoose_connection: mongoose.connection,
      stringify: false
    })
  }));

  var models = glob.sync(root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });

  var controllers = glob.sync(root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app, io);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: app.get('env') === 'development' ? err : {},
      title: 'error'
    });
  });
};
