var Wall = require('mongoose').model('Wall');

module.exports = function (app, io) {
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
};
