		/**************************** City List Controller ****************************/
app.controller("city_list", function($scope,$http,$location,$modal,$rootScope,$filter,loadData) {
	
	var serviceurl="City_ctrl";
	$scope.animationsEnabled = true;
	$scope.currentPage = 1;
	$scope.numPerPage = 25;
	$scope.maxSize = 5;
	getcitylist();

	function getcitylist(){
		loadData(serviceurl,'getcitylist','').success(function(data){
	    	 $scope.city=data;
	         $scope.pagi=true;

	         $scope.totalitems=Math.ceil($scope.city.length / $scope.numPerPage)*10;

	          var begin = (($scope.currentPage - 1) * $scope.numPerPage)
	    , end = begin + $scope.numPerPage;
		    $scope.filteredCity = $scope.city.slice(begin, end);     
		});
	}
	$scope.getcitylist=getcitylist;

	$scope.pageChanged = function(){
		$scope.totalitems=Math.ceil($scope.city.length / $scope.numPerPage)*10;

	          var begin = (($scope.currentPage - 1) * $scope.numPerPage)
	    , end = begin + $scope.numPerPage;
		    $scope.filteredCity = $scope.city.slice(begin, end);    
	};

	$scope.findcity=function(val){
	    $scope.pagi=false;
 
	 	if(typeof val!="undefined"){
	       if(val.$==""){
	 		getcitylist();
		    return;
		   }

		   $scope.filteredCity=$scope.city; 
		}
    }

	$scope.opencitydialog = function (size) { 	
		$scope.cedit=false;
	    var citymodal = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'citydialog',
	      controller: 'CityModalCtrl',
	      size: size,
	      resolve: {
		        scope: function () {
		          return $scope;
		        }
   		  }
	  });
 	};	

	$scope.opencityeditdialog = function (c,size) { 	
	    $scope.cedit=true;
	    $scope.editcity=c;
	    var citymodal = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'citydialog',
	      controller: 'CityModalCtrl',
	      size: size,
	      resolve: {
		        scope: function () {
		          return $scope;
		        }
   		  }
	  });
 	}; 	
});

		/**************************** City Modal Controller ****************************/
app.controller("CityModalCtrl", function($scope,scope,$http,$location,$modal,$modalInstance,$rootScope,loadData){
	
	var serviceurl="City_ctrl";

	if(scope.cedit==true){
		$scope.city=scope.editcity;
		$scope.title="City Editing";
	}
	else{
		$scope.title="City Registration";
	}

	loadData("City_ctrl","getdivisionlist",null).success(function(data){
		$scope.division=data;
		if(scope.cedit==true){
			angular.forEach($scope.division,function(val,key){
				if(val.division_id==scope.editcity.division_id){
					$scope.divisionOne=val;
				}
			});
		}
		else{
			$scope.divisionOne=data[0];			
		}
	});

	$scope.savecity=function(){
		$scope.city.divisionid=$scope.divisionOne.division_id
		if(scope.cedit==false){
			loadData(serviceurl,"savecity",$scope.city).success(function(data){	
				if(data.success==true){
					toastr.success("City Registered Successfully!");
					$modalInstance.close();
					scope.getcitylist();
				}
			});		
		}
		else{
			// console.log($scope.course);
			loadData(serviceurl,"updatecity",$scope.city).success(function(data){	
				if(data.success==true){
					toastr.success("City Updated Successfully!");
					$modalInstance.close();
					scope.getcitylist();
				}
			});			
		}
	}

	$scope.formenter=function(event){
		if(event.keyCode==13){
			if($scope.cityForm.$invalid==false){
				$scope.savecity();
			}
		}
	}

	$scope.closecoursedialog=function(){
   		$modalInstance.close();
    }	
});
