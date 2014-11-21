angular.module('xingwall', [])

  .service('Profile', function ($q) {
    this.all = function (opts) {
      var deferred = $q.defer();
      socket.emit('profiles:all', opts);

      socket.on('profiles:all', function (profiles) {
        deferred.resolve(shuffleArray(profiles));
      });

      return deferred.promise;
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
          Profile.all({wallId: $scope.wallId}).then(function (profiles) {
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

        $scope.setCurrentProfile = function(event, profile) {
          if($scope.currentProfile) {
            $scope.currentProfile.isActive = false;
          }

          $scope.currentProfile = profile;
          $scope.currentProfile.isActive = true;

          setDisplayProfile($scope, profile, (profile ? 0 : 1000));

          event.preventDefault();
        };

        socket.on('profiles:updated', function (profile) {
          $scope.loadData(function() {
            if (!profile) { return;}

            $scope.profiles.filter(function(x, i) {
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
;

// TODO: Remove from global scope
// Source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray (array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

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
