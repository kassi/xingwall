var Wall = require('mongoose').model('Wall');

module.exports = function (app, io) {
  app.post('/walls', function (req, res, next) {
    var wall = new Wall({});
    wall.save(function (err) {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        res.redirect('/walls/' + wall._id);
      }
    });
  });

  app.get('/walls/:wall_id', function (req, res, next) {
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
};
