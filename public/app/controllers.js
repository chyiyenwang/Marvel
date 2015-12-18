angular.module("MarvelCtrls", ["MarvelServices"])
.controller("MarvelCtrl", ["$scope", "Marvel", "Auth", function($scope, Marvel, Auth) {
  $scope.marvels = [];
  $scope.auth = Auth;
  $scope.user = $scope.auth.currentUser();
  $scope.myInterval = 2000;

  Marvel.query(function success(data) {
    // console.log(data)
    var shuffleMarvels = shuffle(data);
    // $scope.filterLimit = 21;
    // $scope.marvels = shuffleMarvels
    $scope.marvels = shuffleMarvels.map(function(obj){
      return {
        id: obj._id,
        url: obj.thumbnail ? (obj.thumbnail.path + "." + obj.thumbnail.extension) : '',
        name: obj.name
      }
    });
    console.log($scope.marvels)
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
  // $scope.addSlide = function() {
  //   var newWidth = 600 + slides.length + 1;
  //   slides.push({
  //     image: [$scope.marvels],
  //     name: [$scope.marvels]
  //   //   image: 'http://placekitten.com/' + newWidth + '/300',
  //   //   text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
  //   //     ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
  //   });
  // };
  // for (var i=0; i<4; i++) {
  //   $scope.addSlide();
  // }

  $scope.$watch('search', function(newVal, oldVal) {
    // console.log(newVal)
    var characters = Marvel.query({name: newVal},function(data){
      $scope.marvels = data.map(function(obj){
        return {
          id: obj._id,
          url: obj.thumbnail ? (obj.thumbnail.path + "." + obj.thumbnail.extension) : '',
          name: obj.name
        }
        console.log($scope.marvels);
      });
    });
    
    // console.log(test)
  })
}])
.controller("MarvelShowCtrl", ["$scope", "$routeParams", "Marvel", "socket", function($scope, $routeParams, Marvel, socket) {
  $scope.tweets = [];

  Marvel.get({id: $routeParams.id}, function(data) {
    $scope.marvels = data;
    $scope.image = data.thumbnail.path.concat(".") + data.thumbnail.extension;
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
  Marvel.get({id: $routeParams.id}, function(data) {
    $scope.marvel = data;
    
    $scope.image = data.thumbnail.path.concat(".") + data.thumbnail.extension;

    $scope.url = data.thumbnail.path;
    $scope.ext = data.thumbnail.extension;
    $scope.height = data.wiki.height;
    $scope.eyes = data.wiki.eyes;
    $scope.weight = data.wiki.weight;
    $scope.hair = data.wiki.hair;
    $scope.education = data.wiki.education;
    $scope.relatives = data.wiki.relatives;
    $scope.debut = data.wiki.debut;
    $scope.bio_text = data.wiki.bio_text;
    $scope.real_name = data.wiki.real_name;
    $scope.identity = data.wiki.identity;
    $scope.citizenship = data.wiki.citizenship;
    $scope.group = data.wiki.group;
    $scope.powers = data.wiki.powers;
  // })
  $scope.putMarvel = function() {

      var params = {
        thumbnail: {
          path: $scope.url,
          extension: $scope.ext,
        },
        wiki: {
          height: $scope.height,
          eyes: $scope.eyes,
          weight: $scope.weight,
          hair: $scope.hair,
          education: $scope.education,
          relatives: $scope.relatives,
          debut: $scope.debut,
          bio_text: $scope.bio_text,
          real_name: $scope.real_name,
          identity: $scope.identity,
          citizenship: $scope.citizenship,
          group: $scope.group,
          powers: $scope.powers
        }
      }
      Marvel.update({id: $routeParams.id}, params);
      $location.path("marvel/" + $routeParams.id);
    }
  })
}])
.controller('NavCtrl', ['$scope', "$location", "Auth", function($scope, $location, Auth) {
  $scope.auth = Auth;
  $scope.user = $scope.auth.currentUser();
  $scope.logout = function() {
    Auth.removeToken();
    $location.path("/");
  };
}])
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', "Alerts", function($scope, $http, $location, Auth, Alerts) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.actionName = "Log in";
  $scope.userAction = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      if (res.data.token) {
        Auth.saveToken(res.data.token);
        $location.path('/');
      } 
      else {
        Alerts.add('danger', 'Incorrect email or password.');
        $location.path('/login');
      }
    }, function error(res) {
      console.log(res.data);
    });
  }
}])
.controller('SignupCtrl', ['$scope', '$http', '$location', 'Auth', "Alerts", function($scope, $http, $location, Auth, Alerts) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.actionName = "Sign up";
  $scope.userAction = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      $http.post('/api/auth', $scope.user).then(function success(res) {
        if (res.data.token) {
          Auth.saveToken(res.data.token);
          $location.path('/');
        } else {
          Alerts.add('danger', 'A user previously signed up with that email address.');
          $location.path('/signup');
        }
      }, function error(res) {
        Alerts.add('danger', res.data.message);
        console.log(res.data);
      });
    }, function error(res) {
      Alerts.add('danger', res.data.message);
      console.log(res.data);
    });
  }
}])
.controller('AlertController', ['$scope', 'Alerts', function($scope, Alerts) {
  $scope.alerts = Alerts.get();

  $scope.closeAlert = function(idx) {
    Alerts.remove(idx);
  };
}]);