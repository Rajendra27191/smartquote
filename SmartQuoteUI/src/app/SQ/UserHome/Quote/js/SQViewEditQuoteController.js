angular.module('sq.SmartQuoteDesktop')
.controller('SQViewEditQuoteController',['$uibModal','$scope','$rootScope','$window','$anchorScroll','$log','$state','$timeout','SQUserHomeServices','hotkeys','$http',function($uibModal,$scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQUserHomeServices,hotkeys,$http){
console.log('initialise SQViewEditQuoteController');
$scope.quoteListView=[];
$scope.quoteView={};
$scope.showEditQuoteView=false;

$scope.form={};
$scope.customerQuote={};
$scope.addProduct={};
$scope.isProductSelected=false;
$scope.isProductInvalid=false;
$scope.isCustomerSelected=false;
$scope.isCustomerInvalid=false;

var isSalesPersonExist=false;
var isSupplierExist=false;

$scope.isAddProductModalShow=false;
$scope.isEditViewShow=false;

$scope.competeQuote=["yes","no"];
$scope.currentSupplierList=[];
$scope.salesPersonList=[];
$scope.userList=[];


// ===============================UIB MODAL CODE=================================//
$scope.animationsEnabled=true;
$scope.openMyModal = function (product) {
	var modalInstance1=$uibModal.open({
	animation: $scope.animationsEnabled,
	backdrop: "static",
	templateUrl: 'addProductModal.html',
	size: 'lg',
	controller: 'SQAddProductModalController',
	resolve: {
	dataToModal: function () {
		var dataToModal
		if ($scope.productButtonStatus=='add') {	
		dataToModal={
			'productButtonStatus':$scope.productButtonStatus,
			'customerQuote':$scope.customerQuote,
			'productList':$scope.productList,
			'productGroupList':$scope.productGroupList,
			'isAddProductModalShow':$scope.isAddProductModalShow,
			}
		}else if ($scope.productButtonStatus=='edit') {
			dataToModal={
			'productButtonStatus':$scope.productButtonStatus,
			'customerQuote':$scope.customerQuote,
			'productList':$scope.productList,
			'productGroupList':$scope.productGroupList,
			'isAddProductModalShow':$scope.isAddProductModalShow,
			'product':$scope.editProduct,
			}	
		}
		return dataToModal
	}
	}
	});
	modalInstance1.result.then(function (dataFromModal) {
	// console.log("dataFromModal");
	// console.log(dataFromModal);
	if (dataFromModal.addNextProduct) {
		$scope.addProductToQuote(dataFromModal);
		$scope.isAddProductModalShow=true;
		$scope.openMyModal();
	}else{
		$scope.addProductToQuote(dataFromModal);
		$scope.isAddProductModalShow=false;
	}
	}, function () {
	$log.info('Modal dismissed at: ' + new Date());
	$scope.isAddProductModalShow=false;
	});

};

// ===============================UIB MODAL CODE=================================//

$scope.init=function(){
$rootScope.showSpinner();
SQUserHomeServices.GetQuoteView();

};
$scope.init();

$scope.handleGetQuoteViewDoneResponse=function(data){
if(data){
	// console.log(data)
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
 	$scope.quoteListView=data.result;
 	// $rootScope.showSpinner();
	SQUserHomeServices.GetServices();
}else{
  $rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventGetQuoteViewDone = $scope.$on("GetQuoteViewDone", function(event, message){
$scope.handleGetQuoteViewDoneResponse(message);      
});

var cleanupEventGetQuoteViewNotDone = $scope.$on("GetQuoteViewNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// Get Terms & Services=====================================


$scope.handleGetServicesDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.serviceList=data.result;
  $scope.serviceList1=data.result;
  // $scope.serviceList1=data.result;
  	// $rootScope.showSpinner();
	SQUserHomeServices.GetTermsConditions();
}
// $rootScope.hideSpinner();
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

// -------------------------------------------------------------------
$scope.handleGetTermsConditionsDoneResponse=function(data){
 // console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.termConditionList=data.result;
  $scope.termConditionList1=data.result;
  // $scope.termConditionList1=data.result;
	
}
 $rootScope.hideSpinner();
}
}
};

var cleanupEventGetTermsConditionsDone = $scope.$on("GetTermsConditionsDone", function(event, message){
$scope.handleGetTermsConditionsDoneResponse(message);      
});

var cleanupEventGetTermsConditionsNotDone = $scope.$on("GetTermsConditionsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// ====================View Edit================
$scope.termConditionList=[];
$scope.servicesList=[];

var quote;
$scope.initEditQuote=function(quote1){
// console.log(quote)
$rootScope.showSpinner();
SQUserHomeServices.GetCurrentSupplierList();
quote=quote1;
};
/*=============GET CURRENT SUPPLIER LIST==================*/
$scope.handleGetCurrentSupplierListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
 	$scope.currentSupplierList=data.result;
 	// $rootScope.showSpinner();
	// SQUserHomeServices.GetSalesPersonList();
	SQUserHomeServices.GetUserList();
}else{
  $rootScope.alertError(data.message);
}
// $rootScope.hideSpinner();
}
}
};

var cleanupEventGetCurrentSupplierListDone = $scope.$on("GetCurrentSupplierListDone", function(event, message){
$scope.handleGetCurrentSupplierListDoneResponse(message);      
});

var cleanupEventGetCurrentSupplierListNotDone = $scope.$on("GetCurrentSupplierListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*==========================GET USER LIST==============================*/
$scope.handleGetUserListDoneResponse=function(data){
if(data){
if (data.code) {	
  if(data.code.toUpperCase()=='SUCCESS'){   
	console.log(data)	;
	$scope.userList=data.result;
	console.log($rootScope.userData);
	$scope.customerQuote.salesPerson='';
	angular.forEach($scope.userList, function(element, key){
		if (element.key==quote.salesPersonId && element.value==quote.salesPerson) {
			console.log("equal")
			$scope.customerQuote.salesPerson=element;
		}
	});
	SQUserHomeServices.GetTermsAndServiceList(quote.quoteId);
	}
  // $rootScope.hideSpinner();
}
}
};

var cleanupEventGetUserListDone = $scope.$on("GetUserListDone", function(event, message){
$scope.handleGetUserListDoneResponse(message);      
});

var cleanupEventGetUserListNotDone = $scope.$on("GetUserListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});


/*=============GET SALES PERSON LIST==================*/
$scope.handleGetSalesPersonListDoneResponse=function(data){
if(data){
// console.log(data)	
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
 	$scope.salesPersonList=data.result;
 	// $rootScope.showSpinner();
	SQUserHomeServices.GetTermsAndServiceList(quote.quoteId);
}else{
  $rootScope.alertError(data.message);
}
// $rootScope.hideSpinner();
}
}
};

var cleanupEventGetSalesPersonListDone = $scope.$on("GetSalesPersonListDone", function(event, message){
$scope.handleGetSalesPersonListDoneResponse(message);      
});

var cleanupEventGetSalesPersonListNotDone = $scope.$on("GetSalesPersonListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// =========GetTermsAndServiceList
$scope.getProductsList=function(){
	console.log("getProductsList")
	// $rootScope.showSpinner();
	var prodLike='';
	SQUserHomeServices.GetProductList(prodLike);
}
$scope.handleGetTermsAndServiceListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	// console.log(data)
 	$scope.selectedTermConditionList=data.result.termConditionList;
 	$scope.selectedServiceList=data.result.serviceList;
	$scope.getProductsList();
	
	
}else{
  $rootScope.alertError(data.message);
}
// $rootScope.hideSpinner();
}
}
};

var cleanupEventGetTermsAndServiceListDone = $scope.$on("GetTermsAndServiceListDone", function(event, message){
$scope.handleGetTermsAndServiceListDoneResponse(message);      
});

var cleanupEventGetTermsAndServiceListNotDone = $scope.$on("GetTermsAndServiceListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// =====================getProductsList=======

$scope.handleGetProductListDoneResponse=function(data){
if(data){
if (data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
  		$rootScope.hideSpinner();
   		$scope.productList=data.result;
		$scope.priceArray=[];
		// $scope.getProductGroup();
		$scope.checkSelectedTermsAndCondition();
		$scope.checkSelectedServices();
  }else{
   $rootScope.hideSpinner();
   $rootScope.alertError(data.message);
  }
// $rootScope.hideLoadSpinner();
}
}
};

var cleanupEventGetProductListDone = $scope.$on("GetProductListDone", function(event, message){
	// console.log("GetProductListDone");
$scope.handleGetProductListDoneResponse(message);      
});

var cleanupEventGetProductListNotDone = $scope.$on("GetProductListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

//========================================================
$scope.checkSelectedServices=function(){
if ($scope.selectedServiceList!='' || $scope.serviceList!='') {
for (var i =0; i<$scope.serviceList.length; i++) {
	if ($scope.selectedServiceList.length>0) {
	for (var j =0; j<$scope.selectedServiceList.length; j++) {
		if ($scope.serviceList[i].key==$scope.selectedServiceList[j].key) {
			$scope.serviceList[i].code=true;
			break;
		}else{
			$scope.serviceList[i].code=false;
		}
	}
}else{
$scope.serviceList[i].code=false;
}
}
}
 // console.log(JSON.stringify($scope.selectedServiceList));
 // console.log(JSON.stringify($scope.serviceList));
};

$scope.checkSelectedTermsAndCondition=function(){
if ($scope.selectedTermConditionList!='' || $scope.termConditionList!='') {
	// console.log("checkSelectedTermsAndCondition")
for (var i =0; i<$scope.termConditionList.length; i++) {
	if ($scope.selectedTermConditionList.length>0) {	
	for (var j =0; j<$scope.selectedTermConditionList.length; j++) {
		if ($scope.termConditionList[i].key==$scope.selectedTermConditionList[j].key) {
			$scope.termConditionList[i].code=true;
			break;
		}else{
			$scope.termConditionList[i].code=false;
		}
	}
	}else{
		$scope.termConditionList[i].code=false;
	}
}
}
// console.log(JSON.stringify($scope.selectedTermConditionList));
// console.log(JSON.stringify($scope.termConditionList));
};





$scope.closeEditProduct=function(){
console.log("closeEditProducts");
};

$scope.viewDetailInformation=function(quote){
	console.log(quote);
	$scope.showEditQuoteView=true;
	var currentQuote=angular.copy(quote);
	if (currentQuote.competeQuote.toUpperCase=='NO') {
	$scope.isCurrentSupplierNameRequired=false;
	}else if (currentQuote.competeQuote.toUpperCase=='YES') {
	$scope.isCurrentSupplierNameRequired=true;
	}
	var salesPerson = {'code': currentQuote.salesPerson, 'key': currentQuote.salesPersonId, 'value': currentQuote.salesPerson}
	var currentSupplierName = {'code': currentQuote.currentSupplierName, 'key': currentQuote.currentSupplierId, 'value': currentQuote.currentSupplierName}
	$scope.isEditViewShow=true;
	currentQuote.currentSupplierName=currentSupplierName;
	currentQuote.salesPerson=salesPerson;
	$scope.customerQuote=currentQuote;
	$scope.initEditQuote(quote);
	$scope.calculateAllInformation();
	$rootScope.isQuoteActivated=true;
};
// ===============****************************=================================
/*=============GET PRODUCT GROUP LIST==================*/
$scope.productGroupList=[];
$scope.getProductGroup=function(){
	// console.log("getProductGroup")
	$rootScope.showSpinner();
	SQUserHomeServices.GetProductGroupList();
	// }
};
$scope.handleGetGetProductGroupListDoneResponse=function(data){
	// console.log(data)
	if(data){
	if (data.code) {
	if(data.code.toUpperCase()=='SUCCESS'){
	$scope.productGroupList=data.result;
	$scope.openMyModal(); 
	}
	$rootScope.hideSpinner();
	// $rootScope.hideLoadSpinner();
	}
	}
};

var cleanupEventGetProductGroupListDone = $scope.$on("GetProductGroupListDone", function(event, message){
$scope.handleGetGetProductGroupListDoneResponse(message);      
});

var cleanupEventGetProductGroupListNotDone = $scope.$on("GetProductGroupListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*=============GET PRODUCT GROUP LIST==================*/
$scope.initProducts=function(){
	$scope.getProductGroup();
};

/*===================GET PRODUCT GROUP DETAILS=================*/
$scope.checkIfProductExist=function(){
		$scope.isProductExist=false;
	 	angular.forEach( $scope.customerQuote.productList, function(value, key){
	 		if (value.itemCode==$scope.addProduct.itemCode) {
	 			// console.log("Duplicates")
	 			$scope.isProductExist=true;
	 		}
	 	});
	};

// $scope.disableCurrentSupplierGP=false;
// $scope.getProductDetails=function(product){
// //console.log(product);
// $rootScope.showSpinner();
// SQUserHomeServices.GetProductDetails(product.code);
// };

// $scope.handleGetProductDetailsDoneResponse=function(data){
// if(data){
// if (data.code) {
//   if(data.code.toUpperCase()=='SUCCESS'){
//   	console.log(data.objProductResponseBean)
//   	$scope.addProduct=angular.copy(data.objProductResponseBean);
//   	$scope.addProduct.quotePrice=null;
//   	$scope.productInfo=angular.copy(data.objProductResponseBean);
//   	$scope.addProduct.itemQty=1;
//   	if ($scope.addProduct.gstFlag.toUpperCase()=='NO') {
//   		$scope.disableCurrentSupplierGP=true;	
//   	};
//   	// $scope.addProduct.itemQty=data.objProductResponseBean.qtyBreak1;
//   	$scope.createArrayOfQuantityAndPrice($scope.addProduct);
//   	$scope.isProductSelected=true;
//   	$scope.isProductInvalid=false;
//   	// $scope.checkIfProductExist();
  	
// 	}else{
// 		$rootScope.alertError(data.message);
// 	}
// }
// }
// $rootScope.hideSpinner();
// };

// var cleanupEventGetProductDetailsDone = $scope.$on("GetProductDetailsDone", function(event, message){
// $scope.handleGetProductDetailsDoneResponse(message);      
// });

// var cleanupEventGetProductDetailsNotDone = $scope.$on("GetProductDetailsNotDone", function(event, message){
// $rootScope.alertServerError("Server error");
// $rootScope.hideSpinner();
// });

// ===================== RESET & CANCEL=====================
$scope.cancelCreateQuote=function(){
	$rootScope.moveToTop();
	$log.debug("cancelCreateQuote call");
	$scope.customerQuote={};
	$scope.addedProductList=[];
	$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
	$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
	$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
	isSupplierExist=false;
	isSalesPersonExist=false;
	$scope.customerQuote.competeQuote="no";
	// $scope.serviceList=[];
	// $scope.termConditionList=[];
	$scope.isEditViewShow=false;
	$scope.form.addCustomerQuote.submitted=false;
	$scope.form.addCustomerQuote.$setPristine();
	$scope.showEditQuoteView=false;
	$scope.showAddProductError=false;
}
// ===================== ADD PRODUCTS=====================
$scope.currentSupplierNameChanged=function(){
	if ($scope.customerQuote.currentSupplierName!='') {
		$scope.customerQuote.competeQuote='yes';	
	}
	if($scope.customerQuote.currentSupplierName==''){
		$scope.customerQuote.competeQuote='no';
	}
}
$scope.competeQuoteChanged=function(){
// console.log($scope.customerQuote.competeQuote)
if ($scope.customerQuote.competeQuote=='no'){
	$scope.customerQuote.currentSupplierName=null;
	$scope.isCurrentSupplierNameRequired=false;
	if($scope.customerQuote.productList.length>0){
		angular.forEach($scope.customerQuote.productList, function(value, key){
			value.currentSupplierPrice=0;
			value.currentSupplierTotal=0;
			value.currentSupplierGP=0;
			value.savings=0;
		});
	}
	$scope.calculateAllInformation();
}
if ($scope.customerQuote.competeQuote=='yes'){
	$scope.isCurrentSupplierNameRequired=true;
}
}



// $scope.productCodeNotFound=function(noProductFound){
// 	if (noProductFound!=undefined) {
// 	// console.log("productCodeNotFound");
// 	// console.log(noProductFound);
// 	if ($scope.productButtonStatus=='add') {
// 	$scope.isNewProduct=noProductFound;
// 	}
// 	}
// };

$scope.productCodeChanged=function(){
// console.log(noProductFound)	
// $scope.isNewProduct=noProductFound
if ($scope.isProductSelected) {
// console.log($scope.isProductSelected)
var code=$scope.addProduct.itemCode;	
$scope.addProduct={};
$scope.productInfo=undefined;
$scope.addProduct.itemCode=code;
$scope.priceArray=[];
// $scope.isProductInvalid=true;
}else{
	if ($scope.addProduct.itemCode) {
		if ($scope.addProduct.itemCode.length==2) {
		// var prodLike='';
	 //    prodLike=$scope.addProduct.itemCode;
		// $rootScope.showLoadSpinner();
		// // $rootScope.showSpinner();
		// SQUserHomeServices.GetProductList(prodLike);
		// $('#targetItemCode').blur();	
		}
	}
}
};
$scope.showAddProductModal=function(status,product,index){
	// console.log($scope.isEditViewShow)
	if ($scope.isEditViewShow) {	
	if ($scope.form.addCustomerQuote.$valid) {
		// console.log("edit valid")
			$scope.productButtonStatus=status;
			$scope.isAddProductModalShow=true;
			// console.log($scope.productButtonStatus)
			if ($scope.productButtonStatus=='add') {
			    $scope.initProducts();
			}else if($scope.productButtonStatus=='edit'){
				// console.log("edit")
				$scope.getProductGroup();
				$scope.editProduct=angular.copy(product);
				$scope.editIndex=index;
			}
	}else{
		$scope.form.addCustomerQuote.submitted=true;		
	}
	}
};
// $scope.resetAddProductToQuote=function(){
// 		$scope.addProduct={};
// 		$scope.isProductExist=false;
// 		$scope.isProductSelected=false;
// 		$scope.isNewProduct=false;
// 		$scope.productInfo=undefined;
// 		$scope.showAddProductError=false;
// 		$scope.form.addProductIntoQuote.submitted=false;
// 		$scope.form.addProductIntoQuote.$setPristine();
		
// 	}
// $scope.closeAddProductModal=function(){
// 		$scope.resetAddProductToQuote();
// 		$log.debug("closeAddProductModal>>>>>")
// 		// $scope.isProductInvalid=false;
// 		$scope.isAddProductModalShow=false;
// 		$scope.productList=[];
// 	  	$('#addProductModal').modal('hide');

// 	};
// $scope.validateSellingPrice=function(){
//  if ($scope.addProduct.avgcost) {
//  	var price =parseFloat($scope.addProduct.quotePrice);
//  	var cost =$scope.addProduct.avgcost;
//  	if (parseFloat(price)>=parseFloat(cost)) {
//  		 // console.log("isSellingPriceValid")	
//  		 $scope.isSellingPriceInvalid=false;
//  	}else{
//  		// console.log("isSellingPriceInvalid")
//      	$scope.isSellingPriceInvalid=true;
//  	}
//  }		
// };
// ===============CALCULATION===============================
$scope.getPriceInPercentage=function(price,cost){
	var val;
	val=((price-cost)/price)*100;
	return val.toFixed(2);
};
// $scope.getSellingPrice=function(cost,gprequired){
// 	var val;
// 	var val1=cost*100;
// 	var val2=100-gprequired;
// 	val=val1/val2;
// 	return val.toFixed(2);
// };

// $scope.currentSupplierPriceChanged=function(price,cost){
// 	// console.log("currentSupplierPriceChanged");
// 	if ($scope.form.addProductIntoQuote.currentSupplierPrice.$valid) {
// 	$scope.addProduct.currentSupplierGP=$scope.getPriceInPercentage(price,cost);
// 	}else{
// 		$scope.addProduct.currentSupplierGP=0;
// 	}
// };
// $scope.sellingPriceChanged=function(price,cost){
// 	// console.log("sellingPriceChanged");
// 	var price1=price;
// 	var cost1=cost;
// 	if (price1>=cost1){
// 		$scope.addProduct.gpRequired=$scope.getPriceInPercentage(price1,cost1);
// 	}else{
// 		$scope.addProduct.gpRequired=0;
// 	}
// };
// $scope.GpRequiredChanged=function(cost,gprequired){
// 	// console.log("GpRequiredChanged");
// 	var sellingPrice=$scope.getSellingPrice(cost,gprequired);
// 	if ($scope.form.addProductIntoQuote.quotePrice.$valid) {
// 		$scope.addProduct.quotePrice=sellingPrice;	
// 	}else{
// 		$scope.addProduct.quotePrice=0;
// 	}
// };

$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getSupplierInformation=function(){
	var subtotal=0;
	var gstTotal=0;
	// console.log($scope.customerQuote.pricesGstInclude);
	if ($scope.customerQuote.productList.length>0) {
		angular.forEach($scope.customerQuote.productList, function(value, key){
			// console.log(value);
			subtotal=subtotal+parseFloat(value.currentSupplierTotal);	
			if ($scope.customerQuote.pricesGstInclude) {	
				if (value.gstFlag.toUpperCase()=='YES') {
					gstTotal=gstTotal+((10/100)*value.currentSupplierTotal)
				}
			}
		});
		$scope.supplierInformation.subtotal=subtotal;
		$scope.supplierInformation.gstTotal=gstTotal;
		$scope.supplierInformation.total=$scope.supplierInformation.subtotal+$scope.supplierInformation.gstTotal;
	}else{
		$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
	}
};
$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getTotalInformation=function(){
	var subtotal=0;
	var gstTotal=0;
	if ($scope.customerQuote.productList.length>0) {
		angular.forEach($scope.customerQuote.productList, function(value, key){
			subtotal=subtotal+parseFloat(value.total);
			if ($scope.customerQuote.pricesGstInclude) {
			if (value.gstFlag.toUpperCase()=='YES') {
			gstTotal=gstTotal+((10/100)*parseFloat(value.total))
			}
			}
		});
		$scope.totalInformation.subtotal=subtotal;
		$scope.totalInformation.gstTotal=gstTotal;
		$scope.totalInformation.total=$scope.totalInformation.subtotal+$scope.totalInformation.gstTotal;
	}else{
		$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
	}
};

$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
$scope.getGpInformation=function(){
	var gpRequiredSubtotal=0;
	var currentSupplierGPSubtotal=0;
	var countGpRequired=0;
	var countcurrentSupplierGP=0;
	if ($scope.customerQuote.productList.length>0) {
		
		angular.forEach($scope.customerQuote.productList, function(value, key){
			gpRequiredSubtotal=gpRequiredSubtotal+parseFloat(value.gpRequired);
			countGpRequired++;
		});
		angular.forEach($scope.customerQuote.productList, function(value, key){
			currentSupplierGPSubtotal=currentSupplierGPSubtotal+parseFloat(value.currentSupplierGP);
			countcurrentSupplierGP++;
		});
		$scope.gpInformation.avgGpRequired=gpRequiredSubtotal/countGpRequired;
		$scope.gpInformation.avgCurrentSupplierGp=currentSupplierGPSubtotal/countcurrentSupplierGP;
	}else{
		$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};	
	}
};

$scope.calculateAllInformation=function(){
	console.log("calculateAllInformation")
	$scope.getSupplierInformation();
  	$scope.getGpInformation();
  	$scope.getTotalInformation();	
};

$scope.addProductToQuote=function(dataFromModal){
	// console.log("addProductToQuote>>>>>")
	$scope.addProduct=dataFromModal.addProduct;
	$scope.productButtonStatus=dataFromModal.productButtonStatus;
	$scope.isNewProduct=dataFromModal.isNewProduct;
	// console.log($scope.addProduct)
	var product;
	product=angular.copy($scope.addProduct);
	// console.log(product);
	if (product.currentSupplierPrice>0 && product.currentSupplierPrice>product.quotePrice) {
	product.savings=$scope.getPriceInPercentage(product.currentSupplierPrice,product.quotePrice);	
	}else{
	product.savings=0;	
	}
	if (product.currentSupplierPrice>0) {
	product.currentSupplierGP=$scope.getPriceInPercentage(product.currentSupplierPrice,product.avgcost);	
	}else{
	product.currentSupplierGP=0;	
	product.currentSupplierPrice=0;	
	}
	product.total=product.itemQty*product.quotePrice;
	product.currentSupplierTotal=product.itemQty*product.currentSupplierPrice;
	product.gpRequired=$scope.getPriceInPercentage(product.quotePrice,product.avgcost);

	var newProduct;
	if ($scope.isNewProduct) {
			newProduct={
			'itemCode':product.itemCode,
			'itemDescription':product.itemDescription,
			'productGroupCode':product.productGroup.code,
			'unit':product.unit,
			'avgcost':product.avgcost,
			'itemQty':product.itemQty,
			'currentSupplierPrice':product.currentSupplierPrice,
			'currentSupplierTotal':product.currentSupplierTotal,
			'currentSupplierGP':product.currentSupplierGP,
			'quotePrice':product.quotePrice,
			'total':product.total,
			'gpRequired':product.gpRequired,
			'savings':product.savings,
			'isNewProduct':$scope.isNewProduct,
			'gstFlag':product.gstFlag
			};	
		
	 product=angular.copy(newProduct);
	 $log.debug(JSON.stringify(product))
	}else{
		product.isNewProduct=$scope.isNewProduct;
	}

	if ($scope.productButtonStatus=='add') {
		if ( $scope.customerQuote.productList.length>0) {
 			$scope.customerQuote.productList.push(product);	
  			$scope.calculateAllInformation();
	 	}else{ 		
	 	$scope.customerQuote.productList.push(product);	
	 	$scope.calculateAllInformation();
	    // $scope.closeAddProductModal();
	 	}
	};
 	if ($scope.productButtonStatus=='edit') {
 		$scope.customerQuote.productList[$scope.editIndex]=product;
 		$scope.calculateAllInformation();
 		// $scope.closeAddProductModal();
 	};
	// console.log(product)	
};

// $scope.saveAndAddAnotherProduct=function(){	
// 	var savedProduct=$scope.addProductToQuote();
// 	if (savedProduct) {
// 	 $scope.resetAddProductToQuote();
// 	 $('#targetItemCode').focus();
// 	 // $scope.addMore.addAnotherProduct=false;
// 	 return true;
// 	}
// 	};

// 	$scope.saveProductQuote=function(addAnotherProduct){
// 	console.log("addAnotherProduct........"+$scope.addMore.addAnotherProduct);
// 	var savedProducts;
// 	if (addAnotherProduct) {
// 		savedProducts=$scope.saveAndAddAnotherProduct();
// 		if (savedProducts) {
// 			// $scope.customerQuote.productList=angular.copy($scope.addedProductList);
// 		}
// 	}else if(!addAnotherProduct){
// 	    savedProducts=$scope.addProductToQuote();
// 		if (savedProducts) {
// 			// $scope.customerQuote.productList=angular.copy($scope.addedProductList);
// 			$scope.closeAddProductModal();
// 		}
// 	}
// };

$scope.deleteProductFromQuote=function(index){
	if ($scope.customerQuote.productList.length>0) {
	$scope.customerQuote.productList.splice(index,1);
	$scope.calculateAllInformation();
	}else{
	}
};

// ===================== EDIT PRODUCT=====================
$scope.createArrayOfQuantityAndPrice=function(product){
var qty=[];
var price=[];
$scope.quantityArray=[];
$scope.priceArray=[];
if (product.price0exGST || product.price1exGST || product.price2exGST || product.price3exGST || product.price4exGST) {
price.push(product.price0exGST.toString());
price.push(product.price1exGST.toString());
price.push(product.price2exGST.toString());
price.push(product.price3exGST.toString());
price.push(product.price4exGST.toString());
angular.forEach(price, function(value, key){
	if (value==price[key+1]) {
	}else{
		$scope.priceArray.push(value);
	}
});
}
// console.log($scope.priceArray);
};

$scope.quotePriceFocused=function(){
	$('#quotePrice').change();
}
// ===============****************************=================================
$scope.showCommentModal=function(quote){
	$('#commentModal').modal({ keyboard: false,backdrop: 'static',show: true});
	$scope.customerQuote=quote;
	$scope.comment='';
};

$scope.addComment=function(){
// console.log($scope.comment);
// console.log($scope.customerQuote);
if ($scope.form.commentForm.$valid) {
	$rootScope.showSpinner();
	SQUserHomeServices.AddComment($scope.customerQuote.quoteId,$scope.comment);
}else{
	$scope.form.commentForm.submitted=true;
}
};

/*=============GET PRODUCT GROUP LIST==================*/
/*============= Comment On Quote==================*/
$scope.closeCommentModal=function(quote){
	$('#commentModal').modal('hide');
	$scope.form.commentForm.submitted=false;
   	$scope.form.commentForm.$setPristine();
   	$scope.init();	
};
$scope.handleAddCommentDoneResponse=function(data){
if(data){
if (data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
   	// console.log(data);
 	// var date= moment();
	// var day=date.format('DD');
	// var month=date.format('MMM');
	// var year=date.format('YYYY');
	// var time=moment().format('LT');
	// console.log(date)
	// console.log(day,month,year,time)
	// console.log(moment().month(month).format('MMM'))
   var comment=data.result;
   $scope.customerQuote.commentList.push(comment);
   $scope.comment='';

   $scope.form.commentForm.submitted=false;
   $scope.form.commentForm.$setPristine();
  }else{
   $rootScope.alertError(data.message);
  }
$rootScope.hideSpinner();
}
}
};

var cleanupEventAddCommentDone = $scope.$on("AddCommentDone", function(event, message){
// console.log("AddCommentDone");
$scope.handleAddCommentDoneResponse(message);      
});

var cleanupEventAddCommentNotDone = $scope.$on("AddCommentNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

//============================ Save As PDF =================================
$scope.saveAsPDF=function(quote){
console.log(quote);
// var doc = new jsPDF({
//   orientation: 'landscape',
//   unit: 'in',
//   format: [4, 2]
// })


// doc.addPage()
// doc.addPage()
// doc.text('I am on page 3', 10, 10)
// doc.setPage(1)
// doc.text('I am on page 1', 10, 10)
// doc.save('two-by-four.pdf')
 var url ="/smartquote/custComparison?quoteId="+quote.quoteId;
 window.open(url,'location=1,status=1,scrollbars=1,width=1050,fullscreen=yes,height=1400');
};
//==============================================Update Quote=======================================
$scope.jsonToCreateQuote=function(){
var objQuoteBean={};
var supplierName='';
var supplierId=null;
var salesPerson='';
var salesPersonId=null;
if ($scope.customerQuote.currentSupplierName!=undefined) {
if($scope.customerQuote.currentSupplierName.key){
	supplierName=$scope.customerQuote.currentSupplierName.value;
	supplierId=$scope.customerQuote.currentSupplierName.key
}else{
	supplierName=$scope.customerQuote.currentSupplierName;
	supplierId=0;
}
};
if ($scope.customerQuote.salesPerson!=undefined) {
if ($scope.customerQuote.salesPerson.key) {
	salesPerson=$scope.customerQuote.salesPerson.value;
	salesPersonId=$scope.customerQuote.salesPerson.key;
}else{
	salesPerson=$scope.customerQuote.salesPerson;
	salesPersonId=0;
}
};
var monthlyAvgPurchase=0;
var isNewCustomer='no';
if ($scope.isNewCustomer) {
monthlyAvgPurchase=$scope.customerQuote.monthlyAvgPurchase;
isNewCustomer='yes';
};

objQuoteBean={

'quoteId':$scope.customerQuote.quoteId,
'custCode':$scope.customerQuote.custCode,
'custName':$scope.customerQuote.custName,
'address':$scope.customerQuote.address,
'email':$scope.customerQuote.email,
'faxNo':$scope.customerQuote.faxNo,
'phone':$scope.customerQuote.phone,
'monthlyAvgPurchase':monthlyAvgPurchase.toString(),
'isNewCustomer':isNewCustomer,
'quoteAttn':$scope.customerQuote.quoteAttn,
'currentSupplierName':supplierName,
'currentSupplierId':supplierId,
'competeQuote':$scope.customerQuote.competeQuote,
'salesPerson':salesPerson,
'salesPersonId':salesPersonId,
'pricesGstInclude':$scope.customerQuote.pricesGstInclude,
'notes':$scope.customerQuote.notes,
'productList':$scope.customerQuote.productList,
'serviceList':$scope.serviceList,
'termConditionList':$scope.termConditionList,
}
// console.log(JSON.stringify(objQuoteBean))
// return JSON.stringify(objQuoteBean);
 return objQuoteBean;
}

$scope.updateQuote=function(){
$log.debug("updateQuote call");
// console.log();
if ($scope.form.addCustomerQuote.$valid) {
 // $scope.jsonToCreateQuote();
 // $log.debug(JSON.stringify($scope.customerQuote));
	if ($scope.customerQuote.productList.length>0) {
		isSalesPersonExist=false;
		isSupplierExist=false;
		 // console.log($scope.customerQuote.currentSupplierName)
		// console.log($scope.customerQuote.currentSupplierName!=undefined)
		angular.forEach($scope.currentSupplierList, function(currentSupplierName, key){
			if ($scope.customerQuote.currentSupplierName!=undefined) {	
				// console.log(currentSupplierName)
				if ($scope.customerQuote.currentSupplierName.key) {
				}else{
				if ($scope.customerQuote.currentSupplierName.toUpperCase()==currentSupplierName.value.toUpperCase()){
					isSupplierExist=true;
					// console.log("isSupplierExist")
					}	
				}
			}
			
		});
		// angular.forEach($scope.salesPersonList, function(salesPerson, key){
		// 	if ($scope.customerQuote.salesPerson!=undefined) {	
		// 	if ($scope.customerQuote.salesPerson.key) {
		// 	}else{
		// 	if ($scope.customerQuote.salesPerson.toUpperCase()==salesPerson.value.toUpperCase()){
		// 		// console.log("isSalesPersonExist")
		// 		isSalesPersonExist=true;
		// 	}	
		// 	}
		// 	}
		// });
		// $log.debug("valid form");
		if (isSupplierExist) {
			if (isSupplierExist) {
				$scope.form.addCustomerQuote.currentSupplierName.$invalid=true;
				$scope.form.addCustomerQuote.submitted=true;
				$('#currentSupplierName').focus();
			}else{
				$scope.form.addCustomerQuote.currentSupplierName.$invalid=false;
			}
			// if (isSalesPersonExist) {
			// 	$('#salesPerson').focus();
			// 	$scope.form.addCustomerQuote.salesPerson.$invalid=true;
			// 	$scope.form.addCustomerQuote.submitted=true;
			// }else{
			// 	$scope.form.addCustomerQuote.salesPerson.$invalid=false;
			// }
		}else{
			console.log(JSON.stringify($scope.jsonToCreateQuote()));
			$rootScope.showSpinner();
			SQUserHomeServices.UpdateQuote1(JSON.stringify($scope.jsonToCreateQuote()));
		}
	}else{
		$log.debug("please add products");
		$scope.showAddProductError=true;
		$('#addProductLink').focus();
	}


}else{
	$log.debug("invalid form");
	$rootScope.moveToTop();
	$scope.form.addCustomerQuote.submitted=true;
}
};
$scope.handleUpdateQuoteDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	// console.log(data)
  	 // $rootScope.alertSuccess("Successfully updated quote");
  	 swal({
	  title: "Success",
	  text: "Successfully updated quote!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
  	 $scope.cancelCreateQuote();
  	 $scope.init();	
	});
  }else{
  	$rootScope.alertError(data.message);
  }
 $rootScope.hideSpinner();
}}
};

var cleanupEventUpdateQuoteDone = $scope.$on("UpdateQuoteDone", function(event, message){
$scope.handleUpdateQuoteDoneResponse(message);      
});

var cleanupEventUpdateQuoteNotDone = $scope.$on("UpdateQuoteNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

//=================================================================================================

hotkeys.bindTo($scope)
.add({
  combo: 'ctrl+shift+a',
  description: 'Show / hide add product pop-up',
  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  callback: function() {
  	console.log("hotkeys pressed");
  	console.log($scope.isAddProductModalShow)
  	if (!$scope.isAddProductModalShow) {
  	$scope.showAddProductModal('add')
  	}else{
  		$rootScope.closeModal();
  	}
  }
});

hotkeys.bindTo($scope)
.add({
  combo: 'ctrl+shift+z',
  description: 'Add Next Product',
  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  callback: function() {
    console.log("add product");
    console.log($scope.isAddProductModalShow);
  	if ($scope.isAddProductModalShow) {
  		$rootScope.addNextProduct();
  	}

  }
});    

hotkeys.bindTo($scope)
.add({
  combo: 'ctrl+shift+s',
  description: 'Save Quote / Save & Close Product',
  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  callback: function() {
  	 console.log("add product");
  	 console.log($scope.isAddProductModalShow);
  	if ($scope.isAddProductModalShow) {
  		$rootScope.saveAndClose();
  	}else{
  		$scope.updateQuote();
  	}
  }
});

hotkeys.bindTo($scope)
.add({
  combo: 'ctrl+shift+x',
  description: 'Cancel Quote ',
  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  callback: function() {
  	if ($scope.isAddProductModalShow) {
  	}else{
  	$scope.cancelCreateQuote();
  	}
  }
});

$scope.$on('$destroy', function(event, message) {
	cleanupEventAddCommentDone();
	cleanupEventAddCommentNotDone();
	// cleanupEventGetProductDetailsDone();
	// cleanupEventGetProductDetailsNotDone();
	cleanupEventGetProductListDone();
	cleanupEventGetProductListNotDone();
	cleanupEventUpdateQuoteDone();
	cleanupEventUpdateQuoteNotDone();
	cleanupEventGetQuoteViewDone();
	cleanupEventGetQuoteViewNotDone();
	cleanupEventGetCurrentSupplierListDone();
	cleanupEventGetCurrentSupplierListNotDone();
	cleanupEventGetSalesPersonListDone();
	cleanupEventGetSalesPersonListNotDone();
	cleanupEventGetProductGroupListDone();
	cleanupEventGetProductGroupListNotDone();
	$rootScope.isQuoteActivated=false;
});

}]);