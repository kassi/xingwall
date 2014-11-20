$(function() {
  var $window = $(window),
    $detail   = $('.wall-details'),
    $close    = $detail.find('.close');

  function showPrev () {
    $('.wall-profile-entry.active').parent().prev().find('a').trigger('click');
  }

  function showNext () {
    $('.wall-profile-entry.active').parent().next().find('a').trigger('click');
  }

  $window.on('keyup', function(event) {
    // We only want keyboard actions if detail view is open
    if (!$detail.hasClass('active')) {
      return;
    }

    if (event.keyCode === 27) { // Esc key to exit
      $close.trigger('click');
    } else if (event.keyCode === 37) { // Left arrow
      showPrev();
    } else if (event.keyCode === 39) { // Right arrow
      showNext();
    }
  });

  $window.swipe(function(direction, offset) {
    if (offset.x < -200) {
      showPrev();
      console.log('prev');
      return false;
    } else if (offset.x > 200) {
      showNext();
      console.log('next');
      return false;
    }
  });
});
