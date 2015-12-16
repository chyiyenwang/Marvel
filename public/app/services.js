angular.module("MarvelServices", ["ngResource"])
.factory("Marvel", ["$resource", function($resource) {
  return $resource("http://localhost:3000/api/marvels/:id");
}])
.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:3030');
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
.factory('Auth', ['$window', function($window) {
  return {
    saveToken: function(token) {
      $window.localStorage["secretcharacters-token"] = token;
    },
    getToken: function(token) {
      return $window.localStorage["secretcharacters-token"];
    },
    removeToken: function(token) {
      $window.localStorage.removeItem("secretcharacters-token");
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
.factory("AuthInterceptor", ["Auth", function(Auth) {
  return {
    request: function(config) {
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = "Bearer "+token;
      }
      return config;
    }
  };
}]);