/****************  User Controller ****************/
app.controller("user_list", function($scope, $rootScope,$http,$modal,$location,loadData) {
	
	//set navigation permission
    var pArr=$rootScope.upms.split(",");
    var p=[];

    for(pr in pArr){
      p=pArr[pr].split("_");
      if(p[0]=='SManage' && p[1]==0){
        $location.path('403');
      }
    }
	//finished navigation permission

	var serviceurl="User_ctrl";

	$scope.animationsEnabled = true;
	getuserlist();		

	function getuserlist(){	  	
	    loadData(serviceurl,'getuserlist',null).success(function(data){
		    $scope.user=data;
	    });
	}
  	$scope.getuserlist=getuserlist; 


	/* For User Model Dialog */ 
	$scope.toggleAnimation = function () {
  		$scope.animationsEnabled = !$scope.animationsEnabled;
  	};

	 $scope.openuserdialog = function (size) {
	 	$scope.useredit=false;
	    var usermodal = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'userdialog',
	      controller: 'UserModalInstanceCtrl',
	      size: size,
	      resolve: {
		        scope: function () {
		          return $scope;
		        }
   		  }
	  });
 	 };

 	 $scope.openusereditdialog = function (size,u) {
	 	$scope.useredit=true;
	 	$scope.editdata=u;

	    var usermodal = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'userdialog',
	      controller: 'UserModalInstanceCtrl',
	      size: size,
	      resolve: {
		        scope: function () {
		          return $scope;
		        }
   		  }
	  });

 	 };

 	   /*Password reset modal dialog caller*/
     $scope.openresetdialog = function (size,id) {

	 	$scope.resetid=id;
	    var usermodal = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'resetdialog',
	      controller: 'UserResetModalInstanceCtrl',
	      size: size,
	      resolve: {
		        scope: function () {
		          return $scope;
		        }
   		  }
	  });
 	 };
});

					 /****************  User Model Dialog Controller ****************/
app.controller("UserModalInstanceCtrl", function($scope, $rootScope,$http,$modal,$modalInstance,scope,$location,loadData,$filter) {

	var serviceurl="User_ctrl";

	init();
	function init(){	  
	    if(scope.useredit==true){
	    //if for edit,show edit data
	    	// console.log(scope.editdata);

	    	$scope.dialog="User Editing";
	    	$scope.name=scope.editdata.name;
	    	$scope.username=scope.editdata.user_name;
	    	$scope.email=scope.editdata.email;
	    	$scope.phone=scope.editdata.phone;
	    	
	    	if(scope.editdata.gender!=''){
	    		$scope.gendersel=scope.editdata.gender;
	    	}else{
	    		$scope.gendersel=1;
	    	}
    		$scope.nrcno=scope.editdata.nrc_no;
    		$scope.address=scope.editdata.address;

    		$scope.dateofbirth = new Date(scope.editdata.user_dob);
	    	$scope.position = scope.editdata.position;
	    	$scope.startdate = new Date(scope.editdata.start_date);
	    	$scope.statussel = scope.editdata.status;
	    	
	    	$scope.isNameErr=false;
		    $scope.isExist=false;
		    $scope.disuser=true;
		    
		    $scope.password="-";
		    $scope.showpass=false;	    
		    
		    //set active, deactive action
		    if(scope.editdata.user_id!=1)
		    {
		    	if(scope.editdata.is_active==1)
			    {
			    	$scope.active=true;
			    	$scope.deactive=false;
			    }
			    else
			    {
			    	$scope.active=false;
			    	$scope.deactive=true;
			    } 
		    }   
	    }
	    else{
	    	$scope.dialog="User Registration";
	    	$scope.isNameErr=true;
		    $scope.disuser=false;
		    $scope.showpass=true;
		    $scope.passrequired="Required";
		    $scope.phone="";
		    $scope.email="";
		    $scope.gendersel=1;
			$scope.statussel=1;

		    $scope.active=false;
			$scope.deactive=false;	    	
	    }	
	}

    loadData(serviceurl,'getactivegrouplist',null).success(function(data){
	    $scope.grouplist=data;

	    if(scope.useredit==true){
	    	for(g in $scope.grouplist){
	    		if($scope.grouplist[g].user_gp_id==scope.editdata.user_gp_id){
	    			$scope.groupOne=$scope.grouplist[g];
	    		}
	    	}
	    }
	    else{
	    	$scope.groupOne=$scope.grouplist[0];

	    }
    });

    $scope.checkuser=function(username){

    	if(typeof username=="undefined")
    	{
    		$scope.isNameErr=true;
	    	$scope.isExist=false;
    	}
    	else
    	{
    		if(scope.user.length>0){
	    		for(u in scope.user)
		    	{
		    		if(scope.user[u].user_name==username)
		    		{
		    			$scope.isNameErr=true;
		    			$scope.isExist=true;
		    			break;   			
		    		}
		    		else
		    		{
		    			$scope.isNameErr=false;
		    			$scope.isExist=false;
		    		}
		    	}
    		}else{
    			$scope.isNameErr=false;
	    		$scope.isExist=false;    			
    		}
    	}    	
    }

    
    $scope.oneclickbtn = false;
    $scope.saveuser=function(){
    	$scope.oneclickbtn = true;
    	var record={};
    	record.name=$scope.name;
    	record.group_id=$scope.groupOne.user_gp_id;
    	record.username=$scope.username;
    	record.password=$scope.password;
    	record.email=($scope.email == undefined)? "" : $scope.email;
    	record.phone=($scope.phone == undefined)? "" : $scope.phone;

    	record.gender = $scope.gendersel;
    	record.nrcno = ($scope.nrcno == undefined)? "" : $scope.nrcno;
    	record.address = ($scope.address == undefined)? "" : $scope.address;

    	record.dob = $filter('date')($scope.dateofbirth, "yyyy-MM-dd");
    	record.position = ($scope.position == undefined)? "" : $scope.position;
    	record.startdate = $filter('date')($scope.startdate, "yyyy-MM-dd");
    	record.userstatus = $scope.statussel;
    	// console.log(record);

    	if(scope.useredit==true){
    		record.userid=scope.editdata.user_id;

    		loadData(serviceurl,"updateuser",record).success(function(data){    			
	    		if(data.success==true){
		   			toastr.success("User Updated Successfully!");
		   			$modalInstance.close();
		   			scope.getuserlist();
		   		}else{
		   			toastr.warning("Error Updating User");
		   		}	
    		});	
    	}
    	else{
    		loadData(serviceurl,"saveuser",record).success(function(data){    		
	    		if(data.success==true){
		   			toastr.success("User Registered Successfully!");
		   			$modalInstance.close();
		   			scope.getuserlist();
		   		}else{
		   			toastr.warning("Error Registering User");
		   		}	
    		});	
    	}    
    } 

    $scope.updatestatus=function()
    {
    	var record={};
    	record.userid=scope.editdata.user_id;

    	if(scope.editdata.is_active==0)
    	{//if deactivated, active user
    		record.active=1;
    	}
    	else
    	{//else deactivate user
    		record.active=0;
    	}

		loadData(serviceurl,"updatestatus",record).success(function(data){
		
    		if(data.success==true)
	   		{
	   			if(record.active==1)
	   			{
	   				toastr.success("Activated User Successfully!");
	   			}
	   			else
	   			{
	   				toastr.success("Deactivated User Successfully!");
	   			}
	   				   			
	   			$modalInstance.close();
	   			scope.getuserlist();
	   		}else{
	   			toastr.warning("Error Updating User Status!");
	   		}
		});	
    }


	$scope.closeuserdialog=function()
    {
   		$modalInstance.close();
    }

    $scope.formenter=function(event){
		if(event.keyCode==13){
			if($scope.userForm.$invalid==false){
				$scope.saveuser();
			}
		}
	}
});

	 /****************  User Group Controller ****************/
app.controller("user_group_list", function($scope, $rootScope,$http,$modal,$location,loadData) {
	
	//set navigation permission
    var pArr=$rootScope.upms.split(",");
    var p=[];

    for(pr in pArr){
      p=pArr[pr].split("_");
      if(p[0]=='SManage' && p[1]==0){
        $location.path('403');
      }
    }
	//finished navigation permission
	
	var serviceurl="User_ctrl";

	$scope.animationsEnabled = true;
	getgrouplist();		

	function getgrouplist(){	  	
	    loadData(serviceurl,'getgrouplist',null).success(function(data){
		    $scope.grouplist=data;
	    });
	}
  	$scope.getgrouplist=getgrouplist;	

	 /* For User Group Model Dialog */ 
	 $scope.toggleAnimation = function () {
  	 	  $scope.animationsEnabled = !$scope.animationsEnabled;
  	 };

	 $scope.opengroupdialog = function (size) {
	 	$scope.useredit=false;
	    var usermodal = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'groupdialog',
	      controller: 'UserGroupModalCtrl',
	      size: size,
	      resolve: {
		        scope: function () {
		          return $scope;
		        }
   		  }
	  });
 	 };

	 $scope.opengroupeditdialog = function(g,size){
	 	$scope.useredit=true;
	 	$scope.editdata=g;
	    var usermodal = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'groupdialog',
	      controller: 'UserGroupModalCtrl',
	      size: size,
	      resolve: {
		        scope: function () {
		          return $scope;
		        }
   		  }
	  });
 	 };

 	 $scope.openuserdetaildialog = function(g,size){
 	 	$scope.gdetail=g;
	    var udmodal = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'UserDetailDialog',
	      controller: 'UserDetailModalCtrl',
	      size: 'lg',
	      resolve: {
		        scope: function () {
		          return $scope;
		        }
   		  }
	  });
 	 };

});

	 /****************  User Group Add Dialog Controller ****************/
app.controller("UserGroupModalCtrl", function($scope, $rootScope,$http,$modal,$modalInstance,scope,$location,loadData) {
	var serviceurl="User_ctrl";

	init();
	function init(){
		/* set default permission*/
		var defaultper= [{'name':'None','id':0},{'name':'View','id':1},{'name':'Edit','id':2}];//,{'name':'View&Entry&Edit','id':3}
	    var allowper=[{'name':'None','id':0},{'name':'Allow','id':1}];
	  
	    // $scope.pcar=defaultper;
	    $scope.permissionchk=defaultper;
	  
	    if(scope.useredit==true){
	  		//if for edit,show edit data
	    	$scope.title="User Group Editing";		    	    	
	    	$scope.gpname=scope.editdata.group_name;  

	    	//set active, deactive action
		    if(scope.editdata.user_gp_id!=1)
		    {
		    	if(scope.editdata.active_flag==1)
			    {
			    	$scope.active=true;
			    	$scope.deactive=false;
			    }
			    else
			    {
			    	$scope.active=false;
			    	$scope.deactive=true;
			    } 
		    }   

		    //set predefined permission
	    	var pArr=scope.editdata.accesscontrol.split(",");
			var p=[];

			for(pr in pArr){
				p=pArr[pr].split("_");
				if(p[0]=='Schedule')
					$scope.pschedule=$scope.permissionchk[parseInt(p[1])];
				else if(p[0]=='Student')
					$scope.pstudent=$scope.permissionchk[parseInt(p[1])];
				else if(p[0]=='Vehicle')
					$scope.pvehicle=$scope.permissionchk[parseInt(p[1])];
				else if(p[0]=='Class')
					$scope.pclass=$scope.permissionchk[parseInt(p[1])];
				else if(p[0]=='Report')
					$scope.preport=$scope.permissionchk[parseInt(p[1])];
				else if(p[0]=='SManage')
					$scope.psmanage=$scope.permissionchk[parseInt(p[1])];
			}
	    }
	    else
	    {
	    	$scope.title="User Group Registration";
	    	$scope.active=false;
			$scope.deactive=false;
	    	
		    $scope.pschedule=$scope.permissionchk[0];
   	        $scope.pstudent=$scope.permissionchk[0];
   	        $scope.pvehicle=$scope.permissionchk[0];
   	        $scope.pclass=$scope.permissionchk[0];
   	        $scope.preport=$scope.permissionchk[0];
   	        $scope.psmanage=$scope.permissionchk[0];
	    }	
	}

	loadData(serviceurl,"getrolelist",null).success(function(data){
		$scope.role=data;
		if(scope.useredit==true){
			angular.forEach($scope.role,function(val,key){
				if(val.role_id==scope.editdata.role_id){
					$scope.roleOne=val;
				}
			});
		}
		else{
			$scope.roleOne=data[0];			
		}
	});


	$scope.saveuser=function(){
    	var record={};
    	record.roleid=$scope.roleOne.role_id;
    	record.gpname=$scope.gpname;

    	record.permission="Schedule_"+$scope.pschedule.id;
    	record.permission+=",Student_"+$scope.pstudent.id;
    	record.permission+=",Vehicle_"+$scope.pvehicle.id;
    	record.permission+=",Class_"+$scope.pclass.id;
    	record.permission+=",Report_"+$scope.preport.id;
    	record.permission+=",SManage_"+$scope.psmanage.id;

    	if(scope.useredit==true){
    		record.groupid=scope.editdata.user_gp_id;
    		loadData(serviceurl,"updateusergroup",record).success(function(data){    			
	    		if(data.success==true){
		   			toastr.success("User Group Updated Successfully!");
		   			$modalInstance.close();
		   			scope.getgrouplist();
		   		}else{
		   			toastr.warning("Error Updating User Group");
		   		}	
    		});	
    	}
    	else{
    		loadData(serviceurl,"saveusergroup",record).success(function(data){    		
	    		if(data.success==true){
		   			toastr.success("User Group Registered Successfully!");
		   			$modalInstance.close();
		   			scope.getgrouplist();
		   		}else{
		   			toastr.warning("Error Registering User Group");
		   		}	
    		});	
    	}    
    }

    $scope.updatestatus=function(){
    	var record={};
    	record.groupid=scope.editdata.user_gp_id;

    	if(scope.editdata.active_flag==0)
    	{//if deactivated, active user
    		record.active=1;
    	}
    	else
    	{//else deactivate user
    		record.active=0;
    	}

		loadData(serviceurl,"updategroupstatus",record).success(function(data){		
    		if(data.success==true){
	   			if(record.active==1)
	   			{
	   				toastr.success("Activated Group Successfully!");
	   			}
	   			else
	   			{
	   				toastr.success("Deactivated Group Successfully!");
	   			}
	   				   			
	   			$modalInstance.close();
	   			scope.getgrouplist();
	   		}else{
	   			toastr.warning("Error Updating Group Status!");
	   		}
		});	
    } 


	$scope.closegroupdialog=function(){
		$modalInstance.close();
	}
});

				/* user detail model controler */
app.controller('UserDetailModalCtrl',function($scope,$rootScope,$modalInstance,scope,$http,$modal,$location,loadData){
	var serviceurl="User_ctrl";
	loadData(serviceurl,'getuserdetail',scope.gdetail.user_gp_id).success(function(data){
		// console.log(data);
 		$scope.user=data;
    });

    $scope.closeUserDetailDialog=function(){
    	$modalInstance.close();
    }
});

	 /****************  Password Reset Dialog Controller ****************/
app.controller("UserResetModalInstanceCtrl", function($scope, $rootScope,$http,$modal,$modalInstance,scope,$location,loadData){
	
	var serviceurl="User_ctrl";
	$scope.resetPassword=function(){
		var record={};
		record.userid=scope.resetid;
		record.pass=$scope.passwd;
		
		loadData(serviceurl,"resetPassword",record).success(function(data){
			 if(data.success == true){
	   		 	toastr.success("Successfully Reset Password!");
	   		 	$modalInstance.close();
	   		 }else{
	   		 	toastr.warning("Error Resetting Password!");
	   		 }
		});
	}

	$scope.formenter=function(event){
		if(event.keyCode==13){
			if($scope.resetForm.$invalid==false){
				$scope.resetPassword();
			}
		}
	}

	$scope.closeresetdialog=function(){
   		$modalInstance.close();
    }
});/* End of Password Reset Dialog Controller */
