angular.module('xingwall', [])

  .service('Profile', function ($q) {
    this.all = function () {
      var deferred = $q.defer();
      socket.emit('profiles:all');

      socket.on('profiles:all', function (profiles) {
        deferred.resolve(profiles);
      });

      return deferred.promise;
    }
  })

  .directive('xingwall', function () {
    return {
      restrict: 'A',
      controllerAs: 'wall',
      controller: function ($window, Profile) {
        this.loadData = function () {
          Profile.all().then(function (profiles) {
            this.profiles = profiles;
          }.bind(this));
        };

        socket.on('profiles:updated', function () {
          this.loadData();
        }.bind(this));

        this.loadData();

        this.openPopup = function () {
          window.open('/connect', 'Connect to XING', 'width=600, height=400')
        }
      }
    }
  })
;