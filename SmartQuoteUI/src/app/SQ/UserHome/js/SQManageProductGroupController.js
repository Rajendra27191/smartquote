angular.module('sq.SmartQuoteDesktop')
.controller('SQManageProductGroupController',['$window','$scope','$rootScope','$log','$state','$timeout','SQHomeServices','SQUserHomeServices',function($window,$scope,$rootScope,$log,$state,$timeout,SQHomeServices,SQUserHomeServices){
console.log('initialise SQManageProductGroupController controller');
$window.pageYOffset;
$scope.form={};
$scope.manageProductGroup={};
$scope.buttonstatus='add';
$scope.productGroupList=[];
$scope.isProductGroupSelected=false;

$scope.init=function(){
$rootScope.showSpinner();
SQUserHomeServices.GetProductGroupList();
};

$scope.init();

$scope.reset=function(){
$scope.manageProductGroup={};
$scope.buttonstatus='add';
};

$scope.resetForm=function(){
$scope.form.manageProductGroup.submitted=false;
$scope.form.manageProductGroup.$setPristine();
};

$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8) {
		$scope.reset();
		$scope.resetForm();
    }

};
$scope.productGroupCodeChanged=function(){
console.log("productGroupCodeChanged")
if ($scope.isProductGroupSelected) {
$scope.buttonstatus='add';
var tempcode=$scope.manageProductGroup.productCode;
$scope.reset();
$scope.resetForm();
$scope.manageProductGroup.productCode = tempcode;
}
};
/*=============GET PRODUCT GROUP LIST==================*/
$scope.handleGetGetProductGroupListDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.productGroupList=data.result;

}
}
$rootScope.hideSpinner();
};

var cleanupEventGetProductGroupListDone = $scope.$on("GetProductGroupListDone", function(event, message){
$scope.handleGetGetProductGroupListDoneResponse(message);      
});

var cleanupEventGetProductGroupListNotDone = $scope.$on("GetProductGroupListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*===================GET PRODUCT GROUP DETAILS=================*/

$scope.getProductGroupDetails=function(productgroup){
console.log(productgroup);
$rootScope.showSpinner();
SQUserHomeServices.GetProductGroupDetails(productgroup.code);
};

$scope.handleGetProductGroupDetailsDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	$scope.manageProductGroup=data.objResponseBean;
  	$scope.buttonstatus='edit';
  	$scope.isProductGroupSelected=true;
	}
}
$rootScope.hideSpinner();
};

var cleanupEventGetProductGroupDetailsDone = $scope.$on("GetProductGroupDetailsDone", function(event, message){
$scope.handleGetProductGroupDetailsDoneResponse(message);      
});

var cleanupEventGetProductGroupDetailsNotDone = $scope.$on("GetProductGroupDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*===============SAVE PRODUCT GROUP====================*/
$scope.jsonToSaveProductGroup=function(){
	var productgroup={
		"productCode":$scope.manageProductGroup.productCode,
		"productName":$scope.manageProductGroup.productName,
		"catalogueNo":$scope.manageProductGroup.catalogueNo,
	};
return JSON.stringify(productgroup);
};

$scope.saveProductGroupDetails=function(){
	if($scope.form.manageProductGroup.$valid){
	console.log("valid");
	if ($scope.buttonstatus=='add'){
	var productGroupExist=false;
	$scope.productGroupList.forEach(function(element,index){
	 if(element.code.toLowerCase()==$scope.manageProductGroup.productCode.toLowerCase()){
	 	productGroupExist=true;
	 }	
	});	
	if (productGroupExist) {
	 	$rootScope.alertError("Group code already exist");
	}else{
		$rootScope.showSpinner();
		SQUserHomeServices.CreateProductGroup($scope.jsonToSaveProductGroup());
	}	
	}else if($scope.buttonstatus=='edit'){
		$rootScope.showSpinner();
		console.log($scope.jsonToSaveProductGroup())
		SQUserHomeServices.UpdateProductGroupDetails($scope.jsonToSaveProductGroup());
	}
	//console.log($scope.jsonToSaveCustomer());	
}else{
	$scope.form.manageProductGroup.submitted=true;
}
};

/*==================ADD PRODUCT GROUP RESPONSE===================*/
$scope.handleCreateProductGroupDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data);
  	$scope.isProductGroupSelected=false;
  	$rootScope.alertSuccess("Successfully saved product group");
  	$scope.reset();
  	$scope.resetForm();
  	$scope.init();
	}else{
	$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventCreateProductGroupDone = $scope.$on("CreateProductGroupDone", function(event, message){
$scope.handleCreateProductGroupDoneResponse(message);      
});

var cleanupEventCreateProductGroupNotDone = $scope.$on("CreateProductGroupNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*==================UPDATE PRODUCT GROUP RESPONSE===================*/
$scope.handleUpdateProductGroupDetailsDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
  	$rootScope.alertSuccess("Successfully updated product group");
  	$scope.reset();
	$scope.resetForm();
	$scope.init();
	}else{
		$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventUpdateProductGroupDetailsDone = $scope.$on("UpdateProductGroupDetailsDone", function(event, message){
$scope.handleUpdateProductGroupDetailsDoneResponse(message);      
});

var cleanupEventUpdateProductGroupDetailsNotDone = $scope.$on("UpdateProductGroupDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*==================DELETE CUSTOMER RESPONSE===================*/

$scope.deleteProductGroup=function(){
var productGroupCode=$scope.manageProductGroup.productCode;
//console.log(customerCode);
if (productGroupCode!==''&&productGroupCode!==undefined&&productGroupCode!==null) {
$rootScope.showSpinner();
SQUserHomeServices.DeleteProductGroup(productGroupCode);
}
};
$scope.handleDeleteProductGroupDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	$rootScope.alertSuccess("Successfully deleted product group");
  	$scope.reset();
	$scope.resetForm();
	$scope.init();
	}else{
		$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventDeleteProductGroupDone = $scope.$on("DeleteProductGroupDone", function(event, message){
$scope.handleDeleteProductGroupDoneResponse(message);      
});

var cleanupEventDeleteProductGroupNotDone = $scope.$on("DeleteProductGroupNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});


$scope.$on('$destroy', function(event, message) {
	cleanupEventGetProductGroupListDone();
	cleanupEventGetProductGroupListNotDone();
	cleanupEventGetProductGroupDetailsDone();
	cleanupEventGetProductGroupDetailsNotDone();
	cleanupEventCreateProductGroupDone();
	cleanupEventCreateProductGroupNotDone();
	cleanupEventUpdateProductGroupDetailsDone();
	cleanupEventUpdateProductGroupDetailsNotDone();
	cleanupEventDeleteProductGroupDone();
	cleanupEventDeleteProductGroupNotDone();
});
}]);