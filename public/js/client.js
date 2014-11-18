angular.module('xingwall', [])

  .service('Profile', function ($q) {
    this.all = function (opts) {
      var deferred = $q.defer();
      socket.emit('profiles:all', opts);

      socket.on('profiles:all', function (profiles) {
        deferred.resolve(profiles);
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
        $scope.loadData = function () {
          Profile.all({wallId: $scope.wallId}).then(function (profiles) {
            $scope.profiles = profiles;
          });
        };

        socket.on('profiles:updated', function () {
          $scope.loadData();
        });

        $scope.openPopup = function () {
          window.open('/connect/'+$scope.wallId, 'Connect to XING', 'width=600, height=400')
        }
      }
    }
  })
;
