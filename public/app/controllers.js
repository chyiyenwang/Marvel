angular.module("MarvelCtrls", ["MarvelServices"])
.controller("MarvelCtrl", ["$scope", "Marvel", function($scope, Marvel) {
  $scope.marvels = [];

  Marvel.query(function success(data) {
    var shuffleMarvels = shuffle(data);
    $scope.filterLimit = 20;
    $scope.marvels = shuffleMarvels;
  }, function error(data) {
    console.log(data);
  });
    // -> Fisher–Yates shuffle algorithm
  function shuffle(arr) {
    var m = arr.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }
    return arr;
  };
}])
.controller("MarvelShowCtrl", ["$scope", "$routeParams", "Marvel", function($scope, $routeParams, Marvel) {
  Marvel.get({id: $routeParams.id}, function(data) {
    $scope.marvels = data;
    console.log(data.name);
  }, function(data) {
    console.log(data);
  });

}])
.controller('NavCtrl', ['$scope', "$location", function($scope, $location) {
  $scope.logout = function() {
    // Auth.removeToken();
    $location.path("/");
  };
}]);