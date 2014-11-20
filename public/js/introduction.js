(function(exports) {
  $(function() {
    var MOUSE_WAIT_TIME = 7 * 1000;
    var PRESENT_TIME = 4 * 1000;

    var $window = $(window),
      $document = $(document),
      $detail   = $('.wall-details'),
      $close    = $detail.find('.close'),
      $switch   = $('.intro-switch'),
      stopped   = false,
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
      },

      stop: function (shouldResume) {
        if (shouldResume !== true) {
          stopped = true;
          $switch.removeClass('active');
        }

        clearTimeout(mouseWatch);
      },

      resume: function () {
        if ($detail.is(':visible')) {
          mouseWatch = setTimeout(intro.close.bind(this), PRESENT_TIME);
        } else {
          mouseWatch = setTimeout(intro.introduce.bind(this), MOUSE_WAIT_TIME);
        }

        $switch.addClass('active');
        stopped = false;
      }
    }

    $window.on('mousemove', function() {
      if (stopped) { return;}
      intro.stop();
      intro.resume(); // Have to resume immedietly, no mouse stop event
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
