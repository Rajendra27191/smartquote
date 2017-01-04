angular.module('sq.SmartQuoteDesktop')
.controller('SQUserHomeController',['$scope','$rootScope','$log','$state','$timeout',function($scope,$rootScope,$log,$state,$timeout){
console.log('initialise SQUserHomeController controller');
	
$rootScope.subMenuClicked=function(subMenuName){
	console.log(subMenuName);
	if(subMenuName==='Manage User Group'){
	$state.transitionTo('manageusergroup');		
	}
	if(subMenuName==='Manage User'){
	$state.transitionTo('manageuser');		
	}
	if(subMenuName==='Logout'){
	$rootScope.userSignout();	
	}
};	



}]);