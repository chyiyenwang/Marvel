angular.module("MarvelServices", ["ngResource"])
.factory("Marvel", ["$resource", function($resource) {
  return $resource("/api/marvels/:id", null, {"update": {method: "PUT"}});
}])
.factory('socket', function ($rootScope) {
  var baseUrl = window.location.origin.replace(/^http/, "ws");
  console.log(baseUrl);
  var socket = io.connect(baseUrl);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
})
// .factory('Auth', ['$window', function($window) {
//   return {
//     saveToken: function(token) {
//       $window.localStorage["secretcharacters-token"] = token;
//     },
//     getToken: function(token) {
//       return $window.localStorage["secretcharacters-token"];
//     },
//     removeToken: function(token) {
//       $window.localStorage.removeItem("secretcharacters-token");
//     },
//     isLoggedIn: function() {
//       var token = this.getToken();
//       return token ? true : false;
//     },
//     currentUser: function() {
//       if (this.isLoggedIn()) {
//         var token = this.getToken();
//         try {
//           var payload = JSON.parse($window.atob(token.split('.')[1]));
//           return payload;
//         }
//         catch (err) {
//           return false
//         }
//       }
//     }
//   }
// }])
// .factory("AuthInterceptor", ["Auth", function(Auth) {
//   return {
//     request: function(config) {
//       var token = Auth.getToken();
//       if (token) {
//         config.headers.Authorization = "Bearer "+token;
//       }
//       return config;
//     }
//   };
// }]);
.factory('Auth', ['$window', function($window) {
  return {
    saveToken: function(token) {
      $window.localStorage['secret-token'] = token;
    },
    getToken: function() {
      return $window.localStorage['secret-token'];
    },
    removeToken: function() {
      $window.localStorage.removeItem('secret-token');
    },
    isLoggedIn: function() {
      var token = this.getToken();
      return token ? true : false;
    },
    currentUser: function() {
      if (this.isLoggedIn()) {
        var token = this.getToken();
        try {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return payload;
        }
        catch (err) {
          return false
        }
      }
    }
  }
}])
.factory('AuthInterceptor', ['Auth', function(Auth) {
  return {
    request: function(config) {
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
}])
.factory('Alerts', [function() {
  var alerts = [];

  return {
    clear: function() {
      alerts = [];
    },
    add: function(type, msg) {
      alerts.push({type: type, msg: msg});
    },
    get: function() {
      return alerts;
    },
    remove: function(idx) {
      alerts.splice(idx, 1);
    }
  }
}]);