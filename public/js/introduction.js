(function(exports) {
  $(function() {
    var MOUSE_WAIT_TIME = 6 * 1000;
    var PRESENT_TIME = 6 * 1000;

    var $window = $(window),
      $document = $(document),
      $switch   = $('.intro-switch'),
      stopped   = false,
      timer;

    var intro = {
      getProfiles: function () {
        return $('.wall-profile-entry');
      },

      getDetail: function () {
        return $('.wall-details');
      },

      randomProfile: function () {
        var $profiles = this.getProfiles();
        return $($profiles.get( ~~(Math.random() * $profiles.length) ));
      },

      introduce: function () {
        clearTimeout(timer);

        var $random = this.randomProfile();
        $random.trigger('click');
        timer = setTimeout(this.close.bind(this), PRESENT_TIME);
      },

      close: function () {
        this.getDetail().find('.close').trigger('click');
        $window.trigger('mousemove');
      },

      stop: function (shouldResume) {
        if (shouldResume !== true) {
          stopped = true;
          $switch.removeClass('active');
        }

        clearTimeout(timer);
      },

      resume: function () {
        clearTimeout(timer);

        if (this.getDetail().hasClass('active')) {
          timer = setTimeout(intro.close.bind(this), PRESENT_TIME);
        } else {
          timer = setTimeout(intro.introduce.bind(this), MOUSE_WAIT_TIME);
        }

        $switch.addClass('active');
        stopped = false;
      }
    }

    $window.on('mousemove mousemove keyup', function() {
      if (stopped) { return;}
      intro.resume();
    });

    $switch.on('click', function() {
      if (stopped) {
        intro.resume();
      } else {
        intro.stop();
      }
    });

    $document.on('visibilitychange', function() {
      if (document['hidden'] === false) {
        if (!stopped) {
          intro.resume();
        }
      } else {
        intro.stop(true);
      }
    });

    // Begin the introduction on page load
    intro.resume();

    // Make intro module available to global scope
    exports.intro = intro;
  });
})(this);
