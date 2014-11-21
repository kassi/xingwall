var Wall = require('mongoose').model('Wall'),
    authentication = require('basic-authentication')({
      user: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASSWORD
    });

module.exports = function (app, io) {
  app.get('/admin', authentication, function (req, res) {
    Wall.find()
      .populate('profiles', 'displayName')
      .exec()
      .then(function (walls) {
        res.render('admin/index', { walls: walls });
      }, function (err) {
        console.error(err);
      });
  });
  app.post('/admin/walls', authentication, function (req, res) {
    var wall = new Wall({ name: req.body.name });
    wall.save(function (err) {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        res.redirect('/walls/' + wall._id);
      }
    });
  });

  app.post('/admin/walls/:wall_id/remove_profile', authentication, function (req, res) {
    console.log(req.params);
    Wall.findOne({ _id: req.params.wall_id }).exec()
      .then(function (wall) {
        wall.profiles.pull(req.body.profile_id);

        wall.save(function () {
          io.emit('profiles:updated');
          res.redirect('/');
        });
      }, function (err) {
        console.error(err);
        res.redirect('/');
      });
  });
};
