angular.module('xingwall', [])

  .service('Profile', function ($q) {
    var webProfiles = {
      amazon: 'Amazon',
      delicious: 'Delicious',
      digg: 'Digg',
      doodle: 'Doodle',
      ebay: 'eBay',
      facebook: 'Facebook',
      flickr: 'Flickr',
      foursquare: 'Foursquare',
      github: 'GitHub',
      'google+': 'Google+',
      homepage: 'Website',
      last_fm: 'Last.fm',
      other: 'Other',
      photobucket: 'Photobucket',
      reddit: 'Reddit',
      slideshare: 'Slideshare',
      'stumble upon': 'Stumble upon',
      twitter: 'Twitter',
      vimeo: 'Vimeo',
      wikipedia: 'Wikipedia',
      yelp: 'Yelp',
      youtube: 'YouTube'
    };

    // Source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffleArray(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    this.all = function (opts) {
      var deferred = $q.defer();
      socket.emit('profiles:all', opts);

      socket.on('profiles:all', function (profiles) {
        deferred.resolve(shuffleArray(profiles));
      });

      return deferred.promise;
    };

    this.labelForWebProfile = function (webProfile) {
      return webProfiles[webProfile];
    }
  })

  .directive('xingwall', function () {
    return {
      link: function (scope, el, attr) {
        scope.wallId = attr.xingwall;
        scope.loadData();
      },
      controller: function ($scope, $window, Profile) {
        $scope.loadData = function (callback) {
          Profile.all({ wallId: $scope.wallId }).then(function (profiles) {
            $scope.profiles = profiles;

            if (callback) {
              callback();
            }
          });
        };

        var timer;
        function setDisplayProfile ($scope, profile, timeout) {
          clearTimeout(timer);
          timer = setTimeout(function() {
            $scope.displayProfile = profile;

            if (profile) {
              $scope.currentProfilePhotoUrl = profile.photoUrls.size_256x256;
            } else {
              $scope.currentProfilePhotoUrl = '/img/loading.gif';
            }

            $scope.$apply();
          }, timeout);
        }

        $scope.setCurrentProfile = function (event, profile) {
          if ($scope.currentProfile) {
            $scope.currentProfile.isActive = false;
          }

          $scope.currentProfile = profile;
          $scope.currentProfile.isActive = true;

          setDisplayProfile($scope, profile, (profile ? 0 : 1000));

          event.preventDefault();
        };

        $scope.labelForWebProfile = Profile.labelForWebProfile;

        socket.on('profiles:updated', function (profile) {
          $scope.loadData(function () {
            if (!profile) {
              return;
            }

            $scope.profiles.filter(function (x, i) {
              if (x.userId === profile.userId) {
                $scope.profiles.splice(i, 1);
              }
            });

            $scope.profiles.unshift(profile);
          });
        });
      }
    }
  })

  .directive('grid', function () {
    return {
      restrict: 'A',
      link: function (scope, elm) {
        var GRID_SIZE = 130; // 128px img + 2px of borders

        var $window = angular.element(window),
            $wall = elm;

        function resizeWall() {
          var winWidth = $window.outerWidth(),
              wallWidth = $wall.outerWidth(),
              columns = Math.floor(wallWidth / GRID_SIZE),
              newWallWidth = columns * GRID_SIZE,
              newOffset = (winWidth - newWallWidth) / 2;

          $wall.css({
            left: newOffset,
            right: newOffset,
            top: newOffset,
            bottom: newOffset
          });
        }

        resizeWall();
      }
    }
  })
;
