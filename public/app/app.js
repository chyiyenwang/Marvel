var app = angular.module('MarvelApp', ['ngRoute', 'MarvelServices', 'MarvelCtrls', 'infinite-scroll']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "app/views/index.html",
    controller: "MarvelCtrl"
  })
  .when("/about", {
    templateUrl: "app/views/about.html"
  })
  .when("/marvel/:id", {
    templateUrl: "app/views/marvel.html",
    controller: "MarvelShowCtrl"
  })
  .when("/login", {
    templateUrl: "app/views/userLogin.html",
    controller: "LoginCtrl"
  })
  .when("/signup", {
    templateUrl: "app/views/userLogin.html",
    controller: "SignupCtrl"
  })
  .otherwise({
    templateUrl: "app/views/404.html"
  });
  $locationProvider.html5Mode(true);
// }])
// .config(['$httpProvider', function($httpProvider) {
//   $httpProvider.interceptors.push('AuthInterceptor');
// }])
// .run(['$rootScope', 'Auth', function($rootScope, Auth) {
//   $rootScope.isLoggedIn = function() {
//     return Auth.isLoggedIn.apply(Auth);
//   }
  }
]);
app.filter('capitalize', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
});