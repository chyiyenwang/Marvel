angular.module("MarvelServices", ["ngResource"])
.factory("Marvel", ["$resource", function($resource) {
  return $resource("http://localhost:3000/api/marvels/:id?limit=10&offset=10");
}]);
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