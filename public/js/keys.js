$(function() {
  var $window = $(window),
    $detail   = $('.wall-details'),
    $close    = $detail.find('.close');

  $window.on('keyup', function(event) {
    // We only want keyboard actions if detail view is open
    if (!$detail.hasClass('active')) {
      return;
    }

    if (event.keyCode === 27) { // Esc key to exit
      $close.trigger('click');
    } else if (event.keyCode === 37) { // Left arrow
      $('.wall-profile-entry.active').parent().prev().find('a').trigger('click')
    } else if (event.keyCode === 39) { // Right arrow
      $('.wall-profile-entry.active').parent().next().find('a').trigger('click')
    }
  });
});
