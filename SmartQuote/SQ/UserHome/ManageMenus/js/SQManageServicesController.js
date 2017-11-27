angular.module('sq.SmartQuoteDesktop')
.controller('SQManageServicesController',function($scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQManageMenuServices,ArrayOperationFactory){
console.log('initialise SQManageServicesController');	
$scope.form={};
$scope.manageService={};

$scope.editing = [];


$scope.init=function(){
// $rootScope.showSpinner();
// SQManageMenuServices.GetServices();
$scope.serviceArray=angular.copy($rootScope.serviceList);
};

$scope.init();

// ================= GetServices List ======================
// $scope.handleGetServicesDoneResponse=function(data){
// // console.log(data)
// if(data){
// if (data.code) {
// if(data.code.toUpperCase()=='SUCCESS'){
// $scope.servicesList=data.result;
// }
// $rootScope.hideSpinner();
// }
// }
// };

// var cleanupEventGetServicesDone = $scope.$on("GetServicesDone", function(event, message){
// $scope.handleGetServicesDoneResponse(message);      
// });

// var cleanupEventGetServicesNotDone = $scope.$on("GetServicesNotDone", function(event, message){
// $rootScope.alertServerError("Server error");
// $rootScope.hideSpinner();
// });
// ================= CreateService ======================

$scope.saveService=function(){
if ($scope.form.manageServices.$valid) {
$log.debug("valid form");
$rootScope.showSpinner();
SQManageMenuServices.CreateService($scope.manageService.service);
}else{
$log.debug("invalid form");
$scope.form.manageServices.submitted=true;
}
}

$scope.handleCreateServiceDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
// $scope.termConditionList=data.result;
var obj={"code":data.genratedId,"key":data.genratedId,"value":$scope.manageService.service}
ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.serviceList,obj)
$scope.init();
$rootScope.alertSuccess("Successfully saved service!");

$scope.manageService={};
$scope.form.manageServices.submitted=false;
$scope.form.manageServices.$setPristine();
}else if (data.code.toUpperCase()=='ERROR'){
$rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventCreateServiceDone = $scope.$on("CreateServiceDone", function(event, message){
$scope.handleCreateServiceDoneResponse(message);      
});

var cleanupEventCreateServiceNotDone = $scope.$on("CreateServiceNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// ================================================================
$scope.editServiceBtnClicked=function(list,index){
// console.log(termConditionList);	
// console.log(index);	
for(var i=0;i<list.length;i++){
if(i == index){
$scope.editing[i] = true;
}else{
$scope.editing[i] = false;
}
}    
};

$scope.stop = function(index){
$scope.editing[index] = false;
$scope.init();
};
// ================= UpdateService ======================
var updatedServiceObj={}
$scope.updateService=function(service,index){
// console.log(service)
updatedServiceObj={}
if (service.value && service.key) {
$scope.updatedIndex=index;
$rootScope.showSpinner();
SQManageMenuServices.UpdateService(service.value,service.key);
updatedServiceObj={"code":service.key,"key":service.key,"value":service.value}
}else{

}
}

$scope.handleUpdateServiceDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
// $scope.termConditionList=data.result;
$scope.stop($scope.updatedIndex);
ArrayOperationFactory.updateArrayKeyValue($rootScope.serviceList,updatedServiceObj);
$scope.init();
$rootScope.alertSuccess("Successfully updated service!");
}else if (data.code.toUpperCase()=='ERROR'){
$rootScope.alertError(data.message);
// $scope.init();
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventUpdateServiceDone = $scope.$on("UpdateServiceDone", function(event, message){
$scope.handleUpdateServiceDoneResponse(message);      
});

var cleanupEventUpdateServiceNotDone = $scope.$on("UpdateServiceNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// ================= DeleteService======================
var deleteObj={}
$scope.deleteService=function(service){
// console.log(service)
deleteObj={}
if (service.value && service.key) {
var previousWindowKeyDown = window.onkeydown;
swal({
title: 'Are you sure?',
text: "You will not be able to recover this customer!",
showCancelButton: true,
closeOnConfirm: false,
}, function (isConfirm) {
window.onkeydown = previousWindowKeyDown;
if (isConfirm) {
$rootScope.showSpinner();
SQManageMenuServices.DeleteService(service.key);
deleteObj={"code":service.key,"key":service.key,"value":service.value}
} 
});

}else{

}
}

$scope.handleDeleteServiceDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
// $scope.termConditionList=data.result;
ArrayOperationFactory.deleteFromArrayKeyValue($rootScope.serviceList,deleteObj);
$scope.init();
$rootScope.alertSuccess("Successfully deleted service!");
}else if (data.code.toUpperCase()=='ERROR'){
$rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventDeleteServiceDone = $scope.$on("DeleteServiceDone", function(event, message){
$scope.handleDeleteServiceDoneResponse(message);      
});

var cleanupEventDeleteServiceNotDone = $scope.$on("DeleteServiceNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

$scope.$on('$destroy', function(event, message) {
	cleanupEventCreateServiceDone();
	cleanupEventCreateServiceNotDone();
	cleanupEventUpdateServiceDone();
	cleanupEventUpdateServiceNotDone();
	cleanupEventDeleteServiceDone();
	cleanupEventDeleteServiceNotDone();
});


});