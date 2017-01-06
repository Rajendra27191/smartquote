angular.module('sq.SmartQuoteDesktop')
.controller('SQManageProductController',['$window','$scope','$rootScope','$log','$state','$timeout','SQHomeServices','SQUserHomeServices',function($window,$scope,$rootScope,$log,$state,$timeout,SQHomeServices,SQUserHomeServices){
console.log('initialise SQManageProductController controller');
$window.pageYOffset;

$scope.form={};
$scope.manageProduct={};
$scope.buttonstatus='add';
$scope.productGroupList=[];
$scope.isProductSelected=false;

$scope.init=function(){
$rootScope.showSpinner();
SQUserHomeServices.GetProductList();
};

$scope.init();

$scope.reset=function(){
$scope.manageProduct={};
$scope.buttonstatus='add';
};

$scope.resetForm=function(){
$scope.form.manageProduct.submitted=false;
$scope.form.manageProduct.$setPristine();
};

$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8) {
		$scope.reset();
		$scope.resetForm();
    }

};
$scope.itemCodeChanged=function(event){
console.log("itemCodeChanged");
console.log(event);
// if ($scope.isProductSelected) {
// $scope.buttonstatus='add';
// var tempcode=$scope.manageProduct.itemCode;
// $scope.reset();
// $scope.resetForm();
// $scope.manageProduct.itemCode = tempcode;
// }
};

/*=============GET PRODUCT GROUP LIST==================*/
$scope.handleGetProductListDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  console.log(data)
  $scope.productList=data.result;

}
}
$rootScope.hideSpinner();
};

var cleanupEventGetProductListDone = $scope.$on("GetProductListDone", function(event, message){
$scope.handleGetProductListDoneResponse(message);      
});

var cleanupEventGetProductListNotDone = $scope.$on("GetProductListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*===================GET PRODUCT GROUP DETAILS=================*/

$scope.getProductDetails=function(product){
//console.log(product);
$rootScope.showSpinner();
SQUserHomeServices.GetProductDetails(product.code);
};

$scope.handleGetProductDetailsDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
  	$scope.manageProduct=data.objProductResponseBean;
  	$scope.isProductSelected=true;
  	$scope.buttonstatus='edit';
	}
}
$rootScope.hideSpinner();
};

var cleanupEventGetProductDetailsDone = $scope.$on("GetProductDetailsDone", function(event, message){
$scope.handleGetProductDetailsDoneResponse(message);      
});

var cleanupEventGetProductDetailsNotDone = $scope.$on("GetProductDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*===============SAVE PRODUCT GROUP====================*/
$scope.jsonToSaveProduct=function(){
	var product={
		"itemCode":$scope.manageProduct.itemCode,
		"itemDescription":$scope.manageProduct.itemDescription,
		"description2":$scope.manageProduct.description2,
		"description3":$scope.manageProduct.description3,
		"unit":$scope.manageProduct.unit,
		"price0exGST":$scope.manageProduct.price0exGST,
		"qtyBreak1":$scope.manageProduct.qtyBreak1,
		"price1exGST":$scope.manageProduct.price1exGST,
		"qtyBreak2":$scope.manageProduct.qtyBreak2,
		"price2exGST":$scope.manageProduct.price2exGST,
		"qtyBreak3":$scope.manageProduct.qtyBreak3,
		"price3exGST":$scope.manageProduct.price3exGST,
		"qtyBreak4":$scope.manageProduct.qtyBreak4,
		"price4exGST":$scope.manageProduct.price4exGST,
		"avgcost":$scope.manageProduct.avgcost,
		"taxCode":$scope.manageProduct.taxCode,
	};
return JSON.stringify(product);
};

$scope.saveProductDetails=function(){
	if($scope.form.manageProduct.$valid){
	console.log("valid");
	if ($scope.buttonstatus=='add'){
	var productExist=false;
	console.log($scope.jsonToSaveProduct());
	
	$scope.productList.forEach(function(element,index){
	 if(element.code.toLowerCase()==$scope.manageProduct.itemCode.toLowerCase()){
	 	productExist=true;
	 }	
	});	
	if (productExist) {
	 	$rootScope.alertError("Item code already exist");
	}else{
		$rootScope.showSpinner();
		SQUserHomeServices.CreateProduct($scope.jsonToSaveProduct());
	}	
	}else if($scope.buttonstatus=='edit'){
		$rootScope.showSpinner();
		console.log($scope.jsonToSaveProduct())
		SQUserHomeServices.UpdateProductDetails($scope.jsonToSaveProduct());
	}
}else{
	$scope.form.manageProduct.submitted=true;
}
};

// /*==================ADD PRODUCT GROUP RESPONSE===================*/
$scope.handleCreateProductDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data);
  	$scope.isProductGroupSelected=false;
  	$rootScope.alertSuccess("Successfully saved product");
  	$scope.reset();
  	$scope.resetForm();
  	$scope.init();
	}else{
	$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventCreateProductDone = $scope.$on("CreateProductDone", function(event, message){
$scope.handleCreateProductDoneResponse(message);      
});

var cleanupEventCreateProductNotDone = $scope.$on("CreateProductNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// /*==================UPDATE PRODUCT GROUP RESPONSE===================*/
$scope.handleUpdateProductDetailsDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
  	$rootScope.alertSuccess("Successfully updated product");
  	$scope.reset();
	$scope.resetForm();
	$scope.init();
	}else{
		$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventUpdateProductDetailsDone = $scope.$on("UpdateProductDetailsDone", function(event, message){
$scope.handleUpdateProductDetailsDoneResponse(message);      
});

var cleanupEventUpdateProductDetailsNotDone = $scope.$on("UpdateProductDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// /*==================DELETE CUSTOMER RESPONSE===================*/

$scope.deleteProduct=function(){
var productCode=$scope.manageProduct.itemCode;
//console.log(customerCode);
if (productCode!==''&&productCode!==undefined&&productCode!==null) {
$rootScope.showSpinner();
SQUserHomeServices.DeleteProduct(productCode);
}
};
$scope.handleDeleteProductDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){
  	$rootScope.alertSuccess("Successfully deleted product");
  	$scope.reset();
	$scope.resetForm();
	$scope.init();
	}else{
		$rootScope.alertError(data.message);
	}
}
$rootScope.hideSpinner();
};

var cleanupEventDeleteProductDone = $scope.$on("DeleteProductDone", function(event, message){
$scope.handleDeleteProductDoneResponse(message);      
});

var cleanupEventDeleteProductNotDone = $scope.$on("DeleteProductNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});


$scope.$on('$destroy', function(event, message) {
	cleanupEventGetProductListDone();
	cleanupEventGetProductListNotDone();
	cleanupEventGetProductDetailsDone();
	cleanupEventGetProductDetailsNotDone();
	cleanupEventCreateProductDone();
	cleanupEventCreateProductNotDone();
	cleanupEventUpdateProductDetailsDone();
	cleanupEventUpdateProductDetailsNotDone();
	cleanupEventDeleteProductDone();
	cleanupEventDeleteProductNotDone();
});
}]);