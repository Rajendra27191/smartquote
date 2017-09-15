angular.module('sq.SmartQuoteDesktop')
.controller('SQManageServicesController',['$scope','$rootScope','$window','$anchorScroll','$log','$state','$timeout','SQUserHomeServices','DTOptionsBuilder', 'DTColumnDefBuilder',function($scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQUserHomeServices,DTOptionsBuilder, DTColumnDefBuilder,DTColumnBuilder){
console.log('initialise SQManageServicesController');	
$scope.form={};
$scope.manageService={};
$scope.servicesList=[];
$scope.editing = [];


$scope.init=function(){
	$rootScope.showSpinner();
	SQUserHomeServices.GetServices();
};

$scope.init();

$scope.persons=[{
    "id": 860,
    "firstName": "Superman",
    "lastName": "Yoda"
}, {
    "id": 870,
    "firstName": "Foo",
    "lastName": "Whateveryournameis"
}, {
    "id": 590,
    "firstName": "Toto",
    "lastName": "Titi"
}, {
    "id": 803,
    "firstName": "Luke",
    "lastName": "Kyle"
},
]
// $scope.initDataTable=function(){
// 	$scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
//     $scope.dtColumnDefs = [
//         DTColumnDefBuilder.newColumnDef(0),
//         DTColumnDefBuilder.newColumnDef(1).notVisible(),
//         DTColumnDefBuilder.newColumnDef(2).notSortable()
        
//     ];
// }
// $scope.initDataTable();
// ================= GetServices List ======================
$scope.handleGetServicesDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.servicesList=data.result;
  // $scope.initDataTable();
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventGetServicesDone = $scope.$on("GetServicesDone", function(event, message){
$scope.handleGetServicesDoneResponse(message);      
});

var cleanupEventGetServicesNotDone = $scope.$on("GetServicesNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// ================= CreateService ======================

$scope.saveService=function(){
	if ($scope.form.manageServices.$valid) {
		$log.debug("valid form");
		$rootScope.showSpinner();
		SQUserHomeServices.CreateService($scope.manageService.service);
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
   	swal({
	  title: "Success",
	  text: "Successfully saved service!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.init();
	});
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
$scope.editServiceBtnClicked=function(termConditionList,index){
// console.log(termConditionList);	
// console.log(index);	
	for(var i=0;i<termConditionList.length;i++){
        if(i == index){
          $scope.editing[i] = true;
        }else{
          $scope.editing[i] = false;
        }
      }    
};

$scope.stop = function(index){
  $scope.editing[index] = false;
};
// ================= UpdateService ======================

$scope.updateService=function(service,index){
	// console.log(service)
	if (service.value && service.key) {
		$scope.updatedIndex=index;
	 	$rootScope.showSpinner();
		SQUserHomeServices.UpdateService(service.value,service.key);

	}else{

	}
}

$scope.handleUpdateServiceDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  // $scope.termConditionList=data.result;
   	swal({
	  title: "Success",
	  text: "Successfully updated service!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.init();
	$scope.stop($scope.updatedIndex);
	});
  
}else if (data.code.toUpperCase()=='ERROR'){
   $rootScope.alertError(data.message);
   $scope.init();
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

$scope.deleteService=function(service){
	// console.log(service)
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
		SQUserHomeServices.DeleteService(service.key);
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
   	swal({
	  title: "Success",
	  text: "Successfully deleted service!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.init();
	});
  
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

	
	
}]);