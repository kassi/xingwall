$(function() {
  var GRID_SIZE = 130; // 128px img + 2px of borders

  var $window   = $(window),
    $wall       = $('.wall');

  function resizeWall () {
    var winWidth     = $window.outerWidth();
    var winHeight    = $window.outerHeight();
    var wallWidth    = $wall.outerWidth();
    var columns      = Math.floor(wallWidth / GRID_SIZE);
    var newWallWidth = columns * GRID_SIZE;
    var newOffset    = (winWidth - newWallWidth) / 2;

    $wall.css('left', newOffset);
    $wall.css('right', newOffset);
    $wall.css('top', newOffset);
    $wall.css('bottom', newOffset);
  }

  resizeWall();
});
