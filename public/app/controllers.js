angular.module("MarvelCtrls", ["MarvelServices"])
.controller("MarvelCtrl", ["$scope", "Marvel", "Auth", function($scope, Marvel, Auth) {
  $scope.marvels = [];
  $scope.auth = Auth;
  $scope.user = $scope.auth.currentUser();

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
.controller("MarvelShowCtrl", ["$scope", "$routeParams", "Marvel", "socket", function($scope, $routeParams, Marvel, socket) {
  $scope.tweets = [];

  Marvel.get({id: $routeParams.id}, function(data) {
    $scope.marvels = data;
    $scope.image = data.thumbnail.path.concat("."+data.thumbnail.extension);
    var parsedName = $scope.marvels.name.split(' (')[0].split(' ').join("").split("-").join("");

    socket.emit('setTweet', {track: '#' + parsedName});
  }, function(data) {
    console.log(data);
  });
 
  socket.on('tweets', function (data) {
    $scope.tweets = $scope.tweets.concat(data);
  });
}])
.controller("MarvelUpdateCtrl", ["$scope", "$routeParams", "$location", "Marvel", function($scope, $routeParams, $location, Marvel) {
  
  $scope.putMarvel = function() {
    var params = {
      path: $scope.url,
      extension: $scope.ext,
      height: $scope.height,
      eyes: $scope.eyes,
      weight: $scope.weight,
      hair: $scope.hair,
      education: $scope.education,
      relatives: $scope.relatives,
      debut: $scope.debut,
      bio: $scope.bio,
      real_name: $scope.realname,
      identity: $scope.identity,
      citizenship: $scope.citizenship,
      group: $scope.group,
      powers: $scope.powers
    }
    Marvel.update({id: $routeParams.id}, {params: params});
    $location.path("marvel/" + $routeParams.id);

  }
}])
.controller('NavCtrl', ['$scope', "$location", "Auth", function($scope, $location, Auth) {
  $scope.auth = Auth;
  $scope.user = $scope.auth.currentUser();
  $scope.logout = function() {
    Auth.removeToken();
    $location.path("/");
  };
}])
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', function($scope, $http, $location, Auth) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.actionName = "Login";
  $scope.userAction = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      $location.path('/');
    }, function error(res) {
      console.log(res.data);
    });
  }
}])
.controller('SignupCtrl', ['$scope', '$http', '$location', 'Auth', function($scope, $http, $location, Auth) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.actionName = "Sign Up";
  $scope.userAction = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      $http.post('/api/auth', $scope.user).then(function success(res) {
        Auth.saveToken(res.data.token);
        $location.path('/');
      }, function error(res) {
        console.log(res.data);
      });
    }, function error(res) {
      console.log(res.data);
    });
  }
}]);