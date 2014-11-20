$(function() {
  var MOUSE_WAIT_TIME = 7 * 1000;
  var PRESENT_TIME = 4 * 1000;

  var $window = $(window),
    $detail   = $('.wall-details'),
    $close    = $detail.find('.close'),
    mouseWatch;

  var intro = {
    getProfiles: function () {
      return $('.wall-profile-entry');
    },

    randomProfile: function () {
      var $profiles = this.getProfiles();
      return $($profiles.get( ~~(Math.random() * $profiles.length) ));
    },

    introduce: function () {
      var $random = this.randomProfile();

      $random.addClass('active');

      setTimeout(function() {
        $random.trigger('click');
        mouseWatch = setTimeout(this.close.bind(this), PRESENT_TIME);
      }.bind(this), 800);
    },

    close: function () {
      $close.trigger('click');
      $window.trigger('mousemove');
    }
  }

  $window.on('mousemove', function() {
    clearTimeout(mouseWatch);

    if ($detail.is(':visible')) {
      mouseWatch = setTimeout(intro.close.bind(this), PRESENT_TIME);
    } else {
      mouseWatch = setTimeout(intro.introduce.bind(intro), MOUSE_WAIT_TIME);
    }
  })

  mouseWatch = setTimeout(intro.introduce.bind(intro), MOUSE_WAIT_TIME);
});
