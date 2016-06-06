app.controller('sidebarCtrl', function($scope, $location, sidebarSvc){	
	init();

	function init(){
		sidebarSvc.getSidebarList();
	}

	$scope.getpath = function(){
		return $location.path().slice(1);
	}

	$scope.$on('$routeChangeSuccess', function(){
		sidebarSvc.getSidebarList();
		$scope.sideMenuList = sidebarSvc.sidebarList;
	})
});

app.controller('navCtrl', function($scope,$rootScope, $location,$modal,$http,$timeout,jwtHelper,loadData,$interval){

   	//get path
	$scope.getpath = function(){
		var path = $location.path();
		var splitpath = path.split("/");
		return splitpath[1];
	}

	var uinfo = [];
	$scope.today = new Date();
	
   	var token = localStorage.getItem('token');

   	if(token && token!=null){
       uinfo.push(jwtHelper.decodeToken(token));
       $scope.navibar = true;
       $rootScope.userid=uinfo[0].admin_id;
       $scope.username=uinfo[0].name;
       // $rootScope.upms= jwtHelper.decodeToken(token).accesscontrol;
       // $rootScope.role = uinfo[0].role;
    }else{
    	$scope.navibar = false;
    }     
    // console.log($rootScope.upms);   


  	$scope.logout=function(){
  		var userid = uinfo[0].admin_id;
	    $rootScope.stop=true;
	    localStorage.removeItem('token');
	    $rootScope.logined=false;
       
     	$http({
            method: 'POST',
            url: 'http://localhost/eunovate/ams/service/index.php/Login_ctrl/logout',
            data: "uid=" + userid,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(res,status){
        	$scope.navibar = false;
        	// $location.path("login");
          window.location = "login";
    	});
  	}

  	$rootScope.logined=false;
  	$scope.getactive=function(){
      return $rootScope.logined;
  	}

		//open change password dialog
	$scope.animationsEnabled = true;
	$scope.toggleAnimation = function () {
	  	$scope.animationsEnabled = !$scope.animationsEnabled;
	  };

		$scope.openchgpassdialog = function (size) {
	      var chgmodal = $modal.open({
	        animation: $scope.animationsEnabled,
	        templateUrl: 'chgpassdialog',
	        controller: 'ChgPassInstanceCtrl',
	        size: size,
	        resolve: {
	            scope: function () {
	              return $scope;
	            }
	        }
	      });
	  };


});  


    /**************************** Change Password Dialog Modal Controller ****************************/
app.controller('ChgPassInstanceCtrl', function ($scope,$rootScope,$modalInstance,scope,$http,$modal,$location,loadData) {
  
  //chg password dialog functions
   var serviceurl="User_ctrl";

   $scope.curpass="";
   $scope.checkcurpass=function()
   {
      $scope.isCurPassErr=false; 
   }

    $scope.checknewpass=function(newpass){
      if($scope.cfmpass==newpass)
      {
        $scope.isConfirmPassErr=false;
      }
      else
      {
        if($scope.cfmpass)
        {
          $scope.isConfirmPassErr=true;
        }
      }
    }

    $scope.checkconfirmpass=function(confirmpass){ 
        if(!confirmpass)
        {
          $scope.isConfirmPassErr=false;
        }
        else
        {

          if($scope.newpass!=confirmpass)
          {
            $scope.isConfirmPassErr=true;
          }
          else
          {
            $scope.isConfirmPassErr=false;
          }
       }
    }

   $scope.changepwd=function(){
      $scope.dischange=true;

      var record={};
      record.userid=$rootScope.userid;
      record.curpass=$scope.curpass;
    
      loadData(serviceurl,"checkcurpass",record).success(function(data){
            // console.log(data);
              if(data.exist==true){
                //if current pass exist,
                var record={};
                record.userid=$rootScope.userid;
                record.pass=$scope.cfmpass;

                loadData(serviceurl,"chgpass",record).success(function(data){
                      if(data.success==true){
                          $modalInstance.close();
                          toastr.success("Password Changed Successfully!");
                      }          
                });
                $scope.isCurPassErr=false;              
              }
              else
              {
                toastr.error("Old Password is Wrong!");
                $scope.isCurPassErr=true;
                $scope.dischange=false;
              }         
        }); 
    }

    $scope.closechgpassdialog=function(){
       $modalInstance.close();
    }
});  
