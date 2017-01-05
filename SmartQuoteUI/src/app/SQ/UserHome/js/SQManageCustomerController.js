angular.module('sq.SmartQuoteDesktop')
.controller('SQManageCustomerController',['$scope','$rootScope','$log','$state','$timeout','$http','SQHomeServices','SQUserHomeServices',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,SQUserHomeServices){
console.log('initialise SQManageCustomerController controller');
$scope.form={};
$scope.manageCustomer={};
$scope.buttonstatus='add';
$scope.address='';
$scope.isAddress=false;
$scope.isCollapsed = true;
$scope.customerList=[];

$scope.collapseDiv=function(){
$scope.isCollapsed = !$scope.isCollapsed;
$scope.address="address1"
};

$scope.init=function(){
$rootScope.showSpinner();
SQUserHomeServices.GetCustomerList();
};

$scope.init();

$scope.reset=function(){
$scope.manageCustomer={};
$scope.buttonstatus='add';
$scope.isCollapsed = true;
$scope.address='';
};

$scope.resetForm=function(){
$scope.form.manageCustomer.$setPristine();
};

/*=============GET CUSTOMER LIST==================*/
$scope.handleGetCustomerListDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.customerList=data.result;

}
}
$rootScope.hideSpinner();
};

var cleanupEventGetCustomerListDone = $scope.$on("GetCustomerListDone", function(event, message){
$scope.handleGetCustomerListDoneResponse(message);      
});

var cleanupEventGetCustomerListNotDone = $scope.$on("GetCustomerListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*===================GET CUSTOMER DETAILS=================*/

$scope.getCustomerDetails=function(customer){
console.log(customer);
$rootScope.showSpinner();
SQUserHomeServices.GetCustomerDetails(customer.code);
};

$scope.handleGetCustomerDetailsDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data);
  	$scope.manageCustomer=data.objResponseBean;
  	$scope.buttonstatus='edit';
  	if ($scope.manageCustomer.address1!=='') {
  		console.log("collapseDiv")
  		$scope.collapseDiv();
  	}
	}
}
$rootScope.hideSpinner();
};

var cleanupEventGetCustomerDetailsDone = $scope.$on("GetCustomerDetailsDone", function(event, message){
$scope.handleGetCustomerDetailsDoneResponse(message);      
});

var cleanupEventGetCustomerDetailsNotDone = $scope.$on("GetCustomerDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*====================OTHER METHODS================================*/

$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8) {
		$scope.reset();
		$scope.resetForm();
    }

};
/*===============CREATE CUSTOMER==================*/
$scope.jsonToSaveCustomer=function(){
	var customer={
		"customerCode":$scope.manageCustomer.customerCode,
		"customerName":$scope.manageCustomer.customerName,
		"phone":$scope.manageCustomer.phone,
		"contactPerson":$scope.manageCustomer.contactPerson,
		"address1":$scope.manageCustomer.address1,
		"address2":$scope.manageCustomer.address2,
		"state":$scope.manageCustomer.state,
		"postalCode":$scope.manageCustomer.postalCode,
		"fax":$scope.manageCustomer.fax,
		"email":$scope.manageCustomer.email,
		"totalStaff":$scope.manageCustomer.totalStaff,
		"avgPurchase":$scope.manageCustomer.avgPurchase,
		"industryType":$scope.manageCustomer.industryType
	};
return JSON.stringify(customer);
};
$scope.saveCustomer=function(){
if($scope.form.manageCustomer.$valid){
	console.log("valid");
	if ($scope.buttonstatus=='add'){
	var customerExist=false;
	$scope.customerList.forEach(function(element,index){
	 if(element.code.toLowerCase()==$scope.manageCustomer.customerCode.toLowerCase()){
	 	customerExist=true;
	 }	
	});	
	if (customerExist) {
	 	$rootScope.alertError("Customer code already exist");
	}else{
		$rootScope.showSpinner();
		SQUserHomeServices.CreateCustomer($scope.jsonToSaveCustomer());
	}	
	}else if($scope.buttonstatus=='edit'){
		$rootScope.showSpinner();
		SQUserHomeServices.UpdateCustomer($scope.jsonToSaveCustomer());
	}
	//console.log($scope.jsonToSaveCustomer());
	
}else{
	$scope.form.manageCustomer.submitted=true;
}
};

/*==================ADD CUSTOMER RESPONSE===================*/
$scope.handleCreateCustomerDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	$rootScope.alertSuccess("Successfully saved customer");
  	$scope.reset();
	$scope.resetForm();
  	$scope.init();
	}else{
		$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventCreateCustomerDone = $scope.$on("CreateCustomerDone", function(event, message){
$scope.handleCreateCustomerDoneResponse(message);      
});

var cleanupEventCreateCustomerNotDone = $scope.$on("CreateCustomerNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*==================UPDATE CUSTOMER RESPONSE===================*/
$scope.handleUpdateCustomerDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	$rootScope.alertSuccess("Successfully updated customer");
  	$scope.reset();
	$scope.resetForm();
	$scope.init();
	}else{
		$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventUpdateCustomerDone = $scope.$on("UpdateCustomerDone", function(event, message){
$scope.handleUpdateCustomerDoneResponse(message);      
});

var cleanupEventUpdateCustomerNotDone = $scope.$on("UpdateCustomerNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*==================DELETE CUSTOMER RESPONSE===================*/

$scope.deleteCustomer=function(){
var customerCode=$scope.manageCustomer.customerCode;
//console.log(customerCode);
if (customerCode!==''&&customerCode!==undefined&&customerCode!==null) {
$rootScope.showSpinner();
SQUserHomeServices.DeleteCustomer(customerCode);
}
};
$scope.handleDeleteCustomerDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	$rootScope.alertSuccess("Successfully deleted customer");
  	$scope.reset();
	$scope.resetForm();
	$scope.init();
	}else{
		$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventDeleteCustomerDone = $scope.$on("DeleteCustomerDone", function(event, message){
$scope.handleDeleteCustomerDoneResponse(message);      
});

var cleanupEventDeleteCustomerNotDone = $scope.$on("DeleteCustomerNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

$scope.$on('$destroy', function(event, message) {
	cleanupEventGetCustomerListDone();
	cleanupEventGetCustomerListNotDone();
	cleanupEventGetCustomerDetailsDone();
	cleanupEventGetCustomerDetailsNotDone();
	cleanupEventCreateCustomerDone();
	cleanupEventCreateCustomerNotDone();
	cleanupEventUpdateCustomerDone();
	cleanupEventUpdateCustomerNotDone();

});

}]);