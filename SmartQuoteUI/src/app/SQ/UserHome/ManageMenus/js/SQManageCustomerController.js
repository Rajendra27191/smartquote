angular.module('sq.SmartQuoteDesktop')
.controller('SQManageCustomerController',['$scope','$rootScope','$log','$state','$timeout','$http','SQHomeServices','SQUserHomeServices',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,SQUserHomeServices){
console.log('initialise SQManageCustomerController controller');
$scope.form={};
$scope.manageCustomer={};
// $scope.buttonstatus='add';
$scope.address='';
$scope.isAddress=false;
$scope.isCollapsed = true;
$scope.customerList=[];
$scope.customerListView=[];
$scope.iscustomerCodeSelected=false;


$scope.collapseDiv=function(){
$scope.isCollapsed = !$scope.isCollapsed;
$scope.address="address1"
};

$scope.init=function(){
$rootScope.showSpinner();
SQUserHomeServices.GetCustomerListView();	
//$rootScope.showSpinner();
//SQUserHomeServices.GetCustomerList();
};

$scope.init();

$scope.reset=function(){
$scope.manageCustomer={};
$scope.buttonstatus='add';
$scope.isCollapsed = true;
$scope.address='';
};

$scope.resetForm=function(){
$scope.form.manageCustomer.submitted=false;
$scope.form.manageCustomer.$setPristine();
};
$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8) {
		$scope.reset();
		$scope.resetForm();
    }

};

$scope.customerCodeChanged=function(){
console.log("customerCodeChanged")
if ($scope.iscustomerCodeSelected) {
$scope.buttonstatus='add';
var tempcode=$scope.manageCustomer.customerCode;
$scope.reset();
$scope.resetForm();
$scope.manageCustomer.customerCode = tempcode;	
}
};
/*=============GET CUSTOMER LIST VIEW==================*/

$scope.handleGetCustomerListViewDoneResponse=function(data){
	// console.log(data)
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.customerListView=data.objCustomersDetailResponseList;
  console.log($scope.customerListView)
}
}
$rootScope.hideSpinner();
};

var cleanupEventGetCustomerListViewDone = $scope.$on("GetCustomerListViewDone", function(event, message){
$scope.handleGetCustomerListViewDoneResponse(message);      
});

var cleanupEventGetCustomerListViewNotDone = $scope.$on("GetCustomerListViewNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*=============ADD CUSTOMER==================*/
$scope.initCustomer=function(){
$scope.isCustomerTableView=true;
$scope.addCustomerBtnShow=true;
$scope.isCustomerAddView=false;	
$scope.buttonstatus='add';

};

$scope.initCustomer();
$scope.addCustomerBtnClicked=function(){
	$scope.isCustomerTableView=false;
	$scope.addCustomerBtnShow=false;
	$scope.isCustomerAddView=true;
};

$scope.cancelAddCustomer=function(){
$scope.reset();
$scope.resetForm();
$scope.initCustomer();
};

$scope.editCustomerBtnClicked=function(customer){
	console.log(customer)
  	$scope.manageCustomer=customer;
  	$scope.buttonstatus='edit';
  	$scope.isCustomerTableView=false;
	$scope.addCustomerBtnShow=false;
	$scope.isCustomerAddView=true;
};

/*=============GET CUSTOMER LIST==================*/
$scope.handleGetCustomerListDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.customerList=data.result;
  console.log($scope.customerList)
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
  	var manageCustomer=data.objResponseBean; 		
  	$scope.manageCustomer=manageCustomer;
  	$scope.buttonstatus='edit';
  	$scope.iscustomerCodeSelected=true;
  	if ($scope.manageCustomer.address1!=='') {
  		// console.log("collapseDiv");
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
  	// $rootScope.alertSuccess("Successfully saved customer");
  	swal({
	  title: "Success",
	  text: "Successfully saved customer!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	$scope.initCustomer();
	});

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
  	// $rootScope.alertSuccess("Successfully updated customer");
  	
	swal({
	  title: "Success",
	  text: "Successfully updated customer!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	$scope.initCustomer();
	});

  	
	
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

$scope.deleteCustomer=function(customer){
var customerCode=customer.customerCode;
//console.log(customerCode);
if (customerCode!==''&&customerCode!==undefined&&customerCode!==null) {
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
	 SQUserHomeServices.DeleteCustomer(customerCode);
	} 
	});
}
};
$scope.handleDeleteCustomerDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	var previousWindowKeyDown = window.onkeydown;
	swal({
	title: 'Success',
	text: "Successfully deleted customer!",
	type:"success"
	}, function (isConfirm) {
	window.onkeydown = previousWindowKeyDown;
	if (isConfirm) {
  	$scope.reset();
	$scope.init();
	$scope.initCustomer();
	} 
	});
  	// $rootScope.alertSuccess("Successfully deleted customer");
	//$scope.resetForm();
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
	cleanupEventGetCustomerListViewDone();
	cleanupEventGetCustomerListViewNotDone();
	cleanupEventGetCustomerListDone();
	cleanupEventGetCustomerListNotDone();
	cleanupEventGetCustomerDetailsDone();
	cleanupEventGetCustomerDetailsNotDone();
	cleanupEventCreateCustomerDone();
	cleanupEventCreateCustomerNotDone();
	cleanupEventUpdateCustomerDone();
	cleanupEventUpdateCustomerNotDone();
	cleanupEventDeleteCustomerDone();
	cleanupEventDeleteCustomerNotDone();

});

}]);