angular.module('sq.SmartQuoteDesktop')
.controller('SQUserHomeController',['$window','$scope','$rootScope','$log','$state','$timeout','SQHomeServices',function($window,$scope,$rootScope,$log,$state,$timeout,SQHomeServices){
console.log('initialise SQUserHomeController controller');
$window.pageYOffset;
$scope.init=function(){
$rootScope.showSpinner();  
SQHomeServices.GetUserGroupInfo();
SQHomeServices.GetUserGroupMenu();  
};
$scope.init();
$rootScope.subMenuClicked=function(subMenuName){
	console.log(subMenuName);
	if(subMenuName.toLowerCase()==='manage user group'){
	$state.transitionTo('manageusergroup');		
	}
	if(subMenuName.toLowerCase()==='manage user'){
	$state.transitionTo('manageuser');		
	}
  if(subMenuName.toLowerCase()==='manage customer'){
    //console.log("mmmmmmmmmmmmmmmmmm")
  $state.transitionTo('managecustomer');    
  }
	if(subMenuName==='Logout'){
	$rootScope.userSignout();	
	}
};

if ($rootScope.isAdmin) {
	
  console.log("isAdmin")
	$rootScope.userNavMenu=$rootScope.userMenu;
}else{
	
}

  // $scope.handleGetUserGroupInfoDoneResponse=function(data){
  //   if(data){
  //     if(data.code.toUpperCase()=='SUCCESS'){   
  //       $rootScope.userGroups=data.result;
  //   }
  // 	}
  // 	console.log("======================");
  // 	$rootScope.hideSpinner();
  // };

  // var cleanupEventGetUserGroupInfoDone = $scope.$on("GetUserGroupInfoDone", function(event, message){
  //   $scope.handleGetUserGroupInfoDoneResponse(message);      
  // });

  // var cleanupEventGetUserGroupInfoNotDone = $scope.$on("GetUserGroupInfoNotDone", function(event, message){
  //   console.log('Some server problem');
  //    $rootScope.hideSpinner();
  // });

  // $scope.handleGetUserGroupMenuDoneResponse=function(data){
  // if(data){
  //   if(data.code.toUpperCase()=='SUCCESS'){   
  //     var result=data.result;
  //     result.forEach(function(element,index){
  //       if(element.menuName=='Profile'){
  //         element.status=true;
  //         console.log(element)
  //         element.subMenuBeans.forEach(function(submenu,index){
  //           submenu.status=true;
  //         });
  //       }
  //     });
  //  	  $rootScope.userMenu=result;
  //     if ($rootScope.isAdmin) {
  //     	$rootScope.userNavMenu=$rootScope.userMenu;
  //     }
  //  	//$rootScope.userNavMenu=$rootScope.userMenu;
  //   }
  //  }
  //   $rootScope.hideSpinner();
  // };

  // var cleanupEventGetUserGroupMenuDone = $scope.$on("GetUserGroupMenuDone", function(event, message){
  //   $scope.handleGetUserGroupMenuDoneResponse(message);      
  // });

  // var cleanupEventGetUserGroupMenuNotDone = $scope.$on("GetUserGroupMenuNotDone", function(event, message){
  //   //console.log('Some server problem');
  //   $rootScope.hideSpinner();
  // });
  /*////////////////////////////////////////*/



$scope.$on('$destroy', function(event, message) {
	// cleanupEventGetUserGroupInfoDone();
	// cleanupEventGetUserGroupInfoNotDone();
	// cleanupEventGetUserGroupMenuDone();
	// cleanupEventGetUserGroupMenuNotDone();
 
});
}]);