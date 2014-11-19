$(function() {
  var GRID_SIZE = 130; // 128px img + 2px of borders

  var $window   = $(window),
    $wall       = $('.wall-profiles'),
    $detail     = $('.wall-details'),
    winWidth    = $window.outerWidth(),
    winHeight   = $window.outerHeight(),
    wallWidth   = $wall.outerWidth(),
    detailWidth = $detail.outerWidth();

  var columns        = Math.floor((winWidth - detailWidth) / GRID_SIZE);
  var newWallWidth   = columns * GRID_SIZE;
  var newDetailWidth = winWidth - newWallWidth;

  $wall.css('width', newWallWidth);
  $detail.css('width', newDetailWidth);
});
