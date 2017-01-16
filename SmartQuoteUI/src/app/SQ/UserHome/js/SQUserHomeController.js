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

$rootScope.menuClicked=function(menuName){
// console.log(menuName);
if(menuName.toLowerCase()==='home'){
  $state.transitionTo('userhome.start');
}

};

$rootScope.subMenuClicked=function(subMenuName){
	console.log(subMenuName);
	if(subMenuName.toLowerCase()==='manage user group'){
	$state.transitionTo('manageusergroup');		
	}
	if(subMenuName.toLowerCase()==='manage user'){
	$state.transitionTo('manageuser');		
	}
  if(subMenuName.toLowerCase()==='manage customer'){
  $state.transitionTo('managecustomer');    
  }
  if(subMenuName.toLowerCase()==='manage product group'){
  $state.transitionTo('manageproductgroup');    
  }
  if(subMenuName.toLowerCase()==='manage product'){
  $state.transitionTo('manageproduct');    
  } 
  if(subMenuName.toLowerCase()==='upload product file'){
  $state.transitionTo('uploadproductfile');    
  }
	if(subMenuName==='Logout'){
	$rootScope.userSignout();	
	}
};



$scope.$on('$destroy', function(event, message) {
	
 
});
}]);