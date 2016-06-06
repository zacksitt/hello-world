var app = angular.module('mmevents', ['ngRoute', 'ui.bootstrap','angular-jwt','angular-storage']);

app.config(['$routeProvider', '$locationProvider','$httpProvider', "jwtInterceptorProvider",	function($routeProvider, $locationProvider,$httpProvider,jwtInterceptorProvider){

	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    jwtInterceptorProvider.tokenGetter = function(store) {
      return localStorage.getItem('token');
    }
    $httpProvider.interceptors.push('jwtInterceptor');


	$routeProvider
	.when('/',{
		templateUrl: './static/partials/home.php'
	})
	.when('/home',{
		templateUrl: './static/partials/home.php'
	})
	.when('/login',{
		templateUrl: './static/partials/login.php'
	})
	.when('/vehicle/:param',{
		templateUrl: './static/partials/vehicle_dtl.php'
	})
  
	.when('/user-list',{
		templateUrl: './static/partials/user_list.php'
	})
  .when('/city-list',{
    templateUrl: './static/partials/city_list.php'
  })
  .when('/township-list',{
    templateUrl: './static/partials/township_list.php'
  })
  
	.when('/404',{
		templateUrl: './static/partials/404.php'
	})
	.when('/403',{
		templateUrl: './static/partials/403.php'
	})
	.otherwise({
		redirectTo: '/404'
	});

	$locationProvider.html5Mode(true);
}])

.controller('homeCtrl', ['$scope','authFactory','$rootScope', function($scope,authFactory,$rootScope)
{
  $rootScope.logined=true;

}])

.controller('userAuthCtrl', ['$scope','authFactory', 'jwtHelper', 'store', '$location','$rootScope', function($scope,authFactory, jwtHelper, store, $location,$rootScope)
{
  var token=localStorage.getItem('token');
  $scope.navibar = false;
  if(token!=null){
    $location.path("/");
  	$scope.navibar = true;
  }else{
    $scope.navibar = false;
   }

   $scope.errormsgshow = false;

  $scope.login = function(user)
  {
    authFactory.login(user).then(function(res)
    {
    	// console.log(res);
        if(res.data.data && res.data.status.code == 0)
        {
            localStorage.setItem('token',res.data.token);

            $rootScope.logined=true;
            window.location = "";
            $scope.errormsgshow = false;
        }else{
        	$scope.errormsgshow = true;
        	$scope.error = "User Name or Password is wrong!";
        }
    });
  }
}])

.factory("authFactory", ["$http", "$q",'jwtHelper', function($http, $q,jwtHelper){
   var authFactory = {};
   authFactory.checkRoles=function(roles){
      var token = localStorage.getItem('token');
      var udata = jwtHelper.decodeToken(token);
      if(roles.indexOf(udata.user_role)>=0){
         return 1;
      }else{
        return 0;
      }
   }
   
   authFactory.login=function(user){
       var deferred;
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: 'service/index.php/Login_ctrl/login',
                data: "username=" + user.username + "&password=" + user.password,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(res)
            {
                deferred.resolve(res);
                console.log(res);
            })
            .then(function(error)
            {
                deferred.reject(error);
            })
            return deferred.promise;
   }
   return authFactory;
}])

.run(["$rootScope", 'jwtHelper', 'store', '$location','authFactory', function($rootScope, jwtHelper, store, $location,authFactory)
{
    $rootScope.$on('$routeChangeStart', function (event, next) 
    {
        $rootScope.stop=true;
        var token=localStorage.getItem('token') || null;
        if(!token || token==null){
            $location.path("/login");
        }else{
        }
        if(token!=null){  
            var bool = jwtHelper.isTokenExpired(token);
            if(bool === true){
                localStorage.removeItem('token');
                // $scope.navibar = false;             
                $location.path("/login");
            }
        }
    });
}])
