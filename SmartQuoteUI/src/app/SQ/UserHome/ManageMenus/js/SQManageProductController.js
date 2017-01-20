angular.module('sq.SmartQuoteDesktop')
.controller('SQManageProductController',['$window','$scope','$rootScope','$log','$state','$timeout','SQHomeServices','SQUserHomeServices',function($window,$scope,$rootScope,$log,$state,$timeout,SQHomeServices,SQUserHomeServices){
console.log('initialise SQManageProductController controller');
$window.pageYOffset;

$scope.form={};
$scope.manageProduct={};
// $scope.buttonstatus='add';
$scope.productList=[];
$scope.isProductSelected=false;

// $scope.init=function(prodLike){
// $rootScope.showSpinner();
// SQUserHomeServices.GetProductList(prodLike);
// };
//$scope.init("");

$scope.reset=function(){
$scope.manageProduct={};
$scope.buttonstatus='add';
$scope.productList=[];
};

$scope.resetForm=function(){
$scope.form.manageProduct.submitted=false;
$scope.form.manageProduct.$setPristine();
};

$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8 || event.key==='Backspace') {
		$scope.reset();
		$scope.resetForm();
    }else{
    	if($scope.manageProduct.itemCode) {	
    	if ($scope.manageProduct.itemCode.length==1) {
    	var prodLike=$scope.manageProduct.itemCode;
    	// $scope.init(prodLike);
    	  }
    	}
    }
};
$scope.itemCodeChanged=function(event){
console.log("itemCodeChanged");
console.log(event);
};

$scope.productListView=[];

$scope.init=function(){
$rootScope.showSpinner();
SQUserHomeServices.GetProductListView();
};

$scope.init();
/*=============GetProductListView==================*/

$scope.handleGetProductListViewDoneResponse=function(data){
if(data){
  if(data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
  console.log(data)
  $scope.productListView=data.objProductDetailResponseList;
  }
  }
}
$rootScope.hideSpinner();
};

var cleanupEventGetProductListViewDone = $scope.$on("GetProductListViewDone", function(event, message){
console.log("GetProductListViewDone");
console.log(message);
$scope.handleGetProductListViewDoneResponse(message);      
});

var cleanupEventGetProductListViewNotDone = $scope.$on("GetProductListViewNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*=============ADD PRODUCT==================*/
$scope.initProduct=function(){
$scope.isProductTableView=true;
$scope.addProductBtnShow=true;
$scope.isProductAddView=false;	
$scope.buttonstatus='add';
};
$scope.initProduct();
$scope.addProductBtnClicked=function(){
	$window.pageYOffset;
	$scope.isProductTableView=false;
	$scope.addProductBtnShow=false;
	$scope.isProductAddView=true;
};

$scope.cancelAddProduct=function(){
$window.pageYOffset;
$scope.initProduct();
};

$scope.editProductBtnClicked=function(product){
	console.log(product)
  	$scope.buttonstatus='edit';
  	$scope.manageProduct=product;
  	$scope.isProductTableView=false;
	$scope.addProductBtnShow=false;
	$scope.isProductAddView=true;
  	
};

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
if(data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data);
  	//$rootScope.alertSuccess("Successfully saved product");
  	swal({
	  title: "Success",
	  text: "Successfully saved product!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	$scope.initProduct();
	});
   	//$scope.init();
	}else{
	$rootScope.alertError(data.message);
	}
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
if(data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
	swal({
	  title: "Success",
	  text: "Successfully updated product!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	$scope.initProduct();
	});
	//$scope.init();
	}else{
		$rootScope.alertError(data.message);
	}
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
$scope.deleteFromProductListView=function(index){
console.log(index);
console.log($scope.productListView.length);
$scope.productListView.splice(index,1);
console.log($scope.productListView.length);
$timeout(function() {
$rootScope.hideSpinner();
}, 3000);
};

$scope.deleteProduct=function(product,index){
var productCode=product.itemCode;
console.log(product);
console.log(index);
$scope.deleteProductIndex=index;
if (productCode!==''&&productCode!==undefined&&productCode!==null) {
var previousWindowKeyDown = window.onkeydown;
swal({
title: 'Are you sure?',
text: "You will not be able to recover this product!",
showCancelButton: true,
closeOnConfirm: false,
}, function (isConfirm) {
window.onkeydown = previousWindowKeyDown;
if (isConfirm) {
$rootScope.showSpinner();
SQUserHomeServices.DeleteProduct(productCode);
} 
});
}
};



$scope.handleDeleteProductDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	// $rootScope.alertSuccess("Successfully deleted product");
  	// $scope.reset();
	// $scope.resetForm();
	var previousWindowKeyDown = window.onkeydown;
	swal({
	title: 'Success',
	text: "Successfully deleted product!",
	type:"success"
	}, function (isConfirm) {
	window.onkeydown = previousWindowKeyDown;
	if (isConfirm) {
	// $scope.init();
	$scope.initProduct();
	$scope.deleteFromProductListView($scope.deleteProductIndex);
	// $scope.deleteFromProductListView($scope.deleteProductIndex);
	
	} 
	});
	}else{
		$rootScope.alertError(data.message);
		$rootScope.hideSpinner();
	}
}
}
};

var cleanupEventDeleteProductDone = $scope.$on("DeleteProductDone", function(event, message){
$scope.handleDeleteProductDoneResponse(message);      
});

var cleanupEventDeleteProductNotDone = $scope.$on("DeleteProductNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*==========================EXTRAAAAAA=============================================================================*/
/*=============GET PRODUCT GROUP LIST==================*/
$scope.handleGetProductListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  console.log(data)
  $scope.productList=data.result;
}
}
}
$rootScope.hideSpinner();
};

var cleanupEventGetProductListDone = $scope.$on("GetProductListDone", function(event, message){
	console.log("GetProductListDone");
	console.log(message);
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
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
  	$scope.manageProduct=data.objProductResponseBean;
  	$scope.isProductSelected=true;
  	$scope.buttonstatus='edit';
	}
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