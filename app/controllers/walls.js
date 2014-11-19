var Wall = require('mongoose').model('Wall');

module.exports = function (app) {
  app.post('/walls', function (req, res) {
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

  app.get('/walls/:wall_id', function (req, res) {
    var wall_id = req.params.wall_id;
    Wall.findById(wall_id, function (err, wall) {
      if (err || !wall) {
        console.log(err);
        res.redirect('/');
      } else {
        res.render('walls/show', { wall_id: wall._id });
      }
    });
  });

  app.post('/walls/:wall_id/remove_profile', function (req, res) {
    console.log(req.params);
    Wall.findOne({ _id: req.params.wall_id }).exec()
      .then(function (wall) {
        wall.profiles.pull(req.body.profile_id);

        wall.save(function () {
          res.redirect('/');
        });
      }, function (err) {
        console.error(err);
        res.redirect('/');
      });
  });
};
