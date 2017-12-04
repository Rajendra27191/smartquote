angular.module('sq.SmartQuoteDesktop')
.controller('SQCreateQuoteController',function($uibModal,$scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQManageMenuServices,SQManageMenuServices,hotkeys,$http,SQQuoteServices,CalculationFactory,ArrayOperationFactory){
console.log('initialise SQCreateQuoteController');

$scope.form={};
$scope.buttonstatus='add';
$scope.customerQuote={};
$scope.customerQuote.productList=[];
$scope.addedProductList=[]; 
$scope.addProduct={};
$scope.isProductSelected=false;
// $scope.isProductInvalid=false;
$scope.isCustomerSelected=false;
$scope.isCustomerInvalid=false;

var isSupplierExist=false;
// var isSalesPersonExist=false;

$scope.isAddProductModalShow=false;

$scope.competeQuote=["Yes","No"];
$scope.customerQuote.competeQuote="No";
$scope.currentSupplierList=[];
// $scope.salesPersonList=[];
// $scope.userLists=[];
$rootScope.addedProductCount=0;


$scope.productList=[];
$scope.isAlternateAdded=false;
$scope.customerQuote.saveWithAlternative=false;


if ($rootScope.userData) {
  if ($rootScope.userData.userType.toLowerCase()=="admin") {
    $scope.disableSalesPersonSelect=false;
  }else{
    $scope.disableSalesPersonSelect=true;
  }
};
//======= Scroll >>>>>
$(window).scroll(function() {
if ($(document).scrollTop() > 70) {
$('.moveTop').show();
} else {
$('.moveTop').hide();
}
});
$scope.moveToCustomerInfo=function(){
$window.scrollTo(0,0);
$("#customerCode").focus();	
}
//======= Scroll <<<<<
//======= Date Control >>>>>
$scope.today = function() {
$scope.dt = new Date();
// console.log($scope.dt)
return $scope.dt;
};
$scope.open1 = function() {
$scope.popup1.opened = true;
};

$scope.initDate=function(){
$scope.popup1={};
$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = "dd-MM-yyyy"//$scope.formats[1];
$scope.dateOptions = {
formatYear: 'yy',
startingDay: 1,
showWeeks: false
};
$scope.customerQuote.createdDate=$scope.today();
};

$scope.quoteDateChanged=function(quoteDate){
// console.log("quoteDateChanged");
// console.log(quoteDate);
// console.log(moment(quoteDate).format());
// console.log(moment(quoteDate).format());
// console.log(moment(quoteDate).format('YYYY-MM-DD,h:mm:ss a'));
};
//======= Date Control <<<<<
//===== Search Product Text Box >>>>>
// $scope.initAuotoComplete=function(){
// console.log("initAuotoComplete...");
// // $scope.selectedProduct=null;
// console.log("1...");
// var timestamp = new Date().getTime();
// products = new Bloodhound({
// datumTokenizer:function(d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
// queryTokenizer: Bloodhound.tokenizers.whitespace,
// prefetch: {
// url: $rootScope.projectName+"/products.json?query=%QUERY",//+timestamp,
// cache: false,
// beforeSend: function(xhr){
// $rootScope.showSpinner();
// console.log("2...");
// },
// filter: function (parsedResponse) {//(devices)
// console.log("3...");
// $rootScope.hideSpinner();
// return parsedResponse;
// // return $.map(devices, function (device) {
// // return {
// // code: device.code,
// // value : device.value
// // };
// // });
// }

// },
// });
// console.log("4...");
// products.clearPrefetchCache();
// products.initialize();
// console.log("5...");
// $rootScope.productsDataset = {
// displayKey: 'value',
// limit: 200,
// source: products.ttAdapter(),
// };
// $rootScope.exampleOptions = {
// displayKey: 'title',
// highlight: true
// };
// console.log("6...");
// };
//===== Search Product Text Box <<<<<

//===== ADD PRODUCT UIB MODAL >>>>>
$scope.animationsEnabled=true;
$scope.openMyModal = function (product,index) {
var modalInstance1=$uibModal.open({
animation: $scope.animationsEnabled,
backdrop: "static",
keyboard: false,
templateUrl: 'addProductModal.html',
size: 'lg',
controller: 'SQAddProductModalController',
resolve: {
dataToModal: function () {
var dataToModal
if ($scope.productButtonStatus=='add') {	
dataToModal={
'quoteStatus':'create',
'productButtonStatus':$scope.productButtonStatus,
'customerQuote':$scope.customerQuote,
'productGroupList':$scope.productGroupList,
'isAddProductModalShow':$scope.isAddProductModalShow,
// 'addedProductCount': $scope.addedProductCount
}
}else if ($scope.productButtonStatus=='edit') {
console.log("editProduct")
console.log(product)
dataToModal={
'quoteStatus':'create',
'productButtonStatus':$scope.productButtonStatus,
'customerQuote':$scope.customerQuote,
'productGroupList':$scope.productGroupList,
'isAddProductModalShow':$scope.isAddProductModalShow,
'product':$scope.editProduct,
// 'addedProductCount': $scope.addedProductCount
}	
}
return dataToModal
}
}
});
// $( "#myAnchor" ).focus();
modalInstance1.result.then(function (dataFromModal) {
// console.log("dataFromModal");
// console.log(dataFromModal);
if (dataFromModal.addNextProduct.toLowerCase()=="addnextproduct") {
	// $scope.addProductToQuote(dataFromModal);
	// $scope.isAddProductModalShow=true;
	// $scope.openMyModal();
}else if(dataFromModal.addNextProduct.toLowerCase()=="saveclose"){
	$rootScope.addProductToQuote(dataFromModal);
	$scope.isAddProductModalShow=false;
}else if(dataFromModal.addNextProduct.toLowerCase()=="sessiontimeout"){
	console.log("Session time out create quote >>")
	$scope.isAddProductModalShow=false;
	$scope.createQuote();
}
}, function () {
$log.info('Modal dismissed at: ' + new Date());
$scope.isAddProductModalShow=false;
});
};
//===== ADD PRODUCT UIB MODAL <<<<<
//===== GET PRODUCT GROUP LIST >>>>>
$scope.productGroupList=[]
$scope.getProductGroup=function(){
console.log("getProductGroup")
$rootScope.showSpinner();
SQManageMenuServices.GetProductGroupList();
};
$scope.handleGetGetProductGroupListDoneResponse=function(data){
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
$scope.productGroupList=data.result;
$rootScope.isQuoteActivated=true;
// $scope.initAuotoComplete();
// $rootScope.globalProductGroupList=data.result;
// SQManageMenuServices.GetUserList();
}else{
$rootScope.hideSpinner();
$rootScope.alertError(data.message);
}
}
$rootScope.hideSpinner();
}
};

var cleanupEventGetProductGroupListDone = $scope.$on("GetProductGroupListDone", function(event, message){
console.log("GetProductGroupListDone");	
$scope.handleGetGetProductGroupListDoneResponse(message);      
});

var cleanupEventGetProductGroupListNotDone = $scope.$on("GetProductGroupListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
//===== GET PRODUCT GROUP LIST <<<<<

// ===== INIT() CreateQuote >>>>>>
function setUserAsSalesPerson () {
	angular.forEach($rootScope.userList, function(element, key){
	if (element.key==$rootScope.userData.userId && element.value==$rootScope.userData.userName) {
	$scope.customerQuote.salesPerson=element;
	}
	});
}
$scope.initCreateQuote=function(status){
console.log("initCreateQuote");
if (status.toLowerCase()=='init1') {
console.log("init1");
// $scope.initAuotoComplete();// for product search 
$scope.getProductGroup();//get product group list for add product
$scope.currentSupplierList=angular.copy($rootScope.supplierList);	
$scope.termConditionArray=angular.copy($rootScope.termConditionList);
// $scope.termConditionList1=angular.copy($rootScope.termConditionList);
$scope.serviceArray=angular.copy($rootScope.serviceList);
// $scope.serviceList1=angular.copy($rootScope.serviceList);
$scope.offerArray=angular.copy($rootScope.offerList);
// $scope.offerList1=angular.copy($rootScope.offerList);
setUserAsSalesPerson();//
$scope.initDate();
} else{
console.log("init2");
$scope.currentSupplierList=angular.copy($rootScope.supplierList);
$scope.termConditionArray=angular.copy($rootScope.termConditionList);
// $scope.termConditionList1=angular.copy($rootScope.termConditionList);
$scope.serviceArray=angular.copy($rootScope.serviceList);
// $scope.serviceList1=angular.copy($rootScope.serviceList);
$scope.offerArray=angular.copy($rootScope.offerList);
// $scope.offerList1=angular.copy($rootScope.offerList);
setUserAsSalesPerson();//
$scope.initDate();
};

// $rootScope.hideSpinner();	
};
$scope.initCreateQuote('init1');
// ======= INIT() CreateQuote <<<<<<
// ======= Customer Panel Code >>>>>
$scope.customerCodeChanged=function(code){
var customerCode=code;	
$scope.isNewCustomer=true;
if (customerCode!=undefined) {
angular.forEach($scope.customerList, function(customer, index){
if (customerCode.code){
if (customer.code.toUpperCase()==customerCode.code.toUpperCase()) {
// console.log("old")
$scope.isNewCustomer=false;
}
}
});
}
if ($scope.isNewCustomer) {
var code=$scope.customerQuote.customerCode;	
// $scope.customerQuote={};
$scope.customerQuote.customerCode='';
$scope.customerQuote.customerName='';
$scope.customerQuote.address='';
$scope.customerQuote.phone='';
$scope.customerQuote.email='';
$scope.customerQuote.fax='';
$scope.customerQuote.attn='';
$scope.customerQuote.customerCode=code;
}else{
$scope.getCustomerDetails(customerCode);
}
// console.log("$scope.isNewCustomer  "+$scope.isNewCustomer)
};
/*===================GET CUSTOMER DETAILS=================*/
$scope.assignCustomerDetails=function(data){
var address='';
address=data.address1;
console.log("asssigning data to customer")
$scope.customerQuote.customerCode=data.customerCode;
$scope.customerQuote.customerName=data.customerName;
$scope.customerQuote.attn=data.contactPerson;
$scope.customerQuote.address=data.address;
$scope.customerQuote.phone=data.phone;
$scope.customerQuote.email=data.email;
$scope.customerQuote.fax=data.fax;
};

$scope.getCustomerDetails=function(customer){
// console.log(customer);
$rootScope.showSpinner();
SQManageMenuServices.GetCustomerDetails(customer.code);
};

$scope.handleGetCustomerDetailsDoneResponse=function(data){
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
$scope.assignCustomerDetails(data.objResponseBean);
$scope.isCustomerSelected=true;
$scope.isCustomerInvalid=false;
}else{
$rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}}
};

var cleanupEventGetCustomerDetailsDone = $scope.$on("GetCustomerDetailsDone", function(event, message){
$scope.handleGetCustomerDetailsDoneResponse(message);      
});

var cleanupEventGetCustomerDetailsNotDone = $scope.$on("GetCustomerDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
// ======= Customer Panel Code >>>>>
// ======= Reset & Cancel Quote >>>>>
$scope.resetCreateQuote=function(){
$log.debug("resetCreateQuote call");
$scope.customerQuote={};
$scope.customerQuote.productList={};
$scope.customerQuote.productList=[];
$scope.addedProductList=[];
$scope.isAddProductModalShow=false;
$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
$scope.altSupplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.altTotalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.altGpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
// isSalesPersonExist=false;
isSupplierExist=false;
$scope.isNewCustomer=false;
$scope.customerQuote.competeQuote="No";
$scope.isAlternateAdded=false;
$scope.customerQuote.saveWithAlternative=false;
$scope.showAddProductError=false;
// $scope.serviceArray=angular.copy($scope.serviceList1);
// $scope.termConditionArray=angular.copy($scope.termConditionList1);
$scope.form.addCustomerQuote.submitted=false;
$scope.form.addCustomerQuote.$setPristine();
$scope.initCreateQuote('init2');
$rootScope.addedProductCount=0;


// $scope.initAuotoComplete();
// setUserAsSalesPerson();
// $scope.initDate();
};
$scope.cancelCreateQuote=function(){
$window.scrollTo(0,0);	
$("#customerCode").focus();
if ($scope.customerQuote.productList) {
if ($scope.customerQuote.productList.length>0) {
var previousWindowKeyDown = window.onkeydown;
swal({
title: 'Confirm Navigation',
text: "Your unsaved data will be lost. \n Are you sure you want to cancel ?",
showCancelButton: true,
closeOnConfirm: true,
cancelButtonText:"Cancel",
confirmButtonText:"Confirm"
}, function (isConfirm) {
if (isConfirm) {
$scope.resetCreateQuote();
}
});
}else{
$scope.resetCreateQuote();
}
}else{
$scope.resetCreateQuote();
};	
};
// ======= Reset & Cancel Quote <<<<<


// ======= Quote Calculations >>>>>
$scope.getPriceInPercentage=function(price,cost){
var val;
val=((price-cost)/price)*100;
return val.toFixed(2);
};

$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getSupplierInformation=function(){
$scope.supplierInformation=CalculationFactory.getSupplierInformation($scope.customerQuote);
};

$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
$scope.getGpInformation=function(){
$scope.gpInformation=CalculationFactory.getGpInformation($scope.customerQuote);
};

$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getTotalInformation=function(){
$scope.totalInformation=CalculationFactory.getTotalInformation($scope.customerQuote);
};


$scope.calculateAllInformation=function(){
// console.log("calculateAllInformation");
$scope.getSupplierInformation();
$scope.getGpInformation();
$scope.getTotalInformation();	
$scope.calculateAlternativeProductsInformation();
};

//===========================
$scope.altSupplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getAltSupplierInformation=function(){
$scope.altSupplierInformation=CalculationFactory.getAltSupplierInformation($scope.customerQuote);
};

$scope.altGpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
$scope.getAltGpInformation=function(){
$scope.altGpInformation=CalculationFactory.getAltGpInformation($scope.customerQuote);
};

$scope.altTotalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getAltTotalInformation=function(){
// console.log("getAltTotalInformation")
$scope.altTotalInformation=CalculationFactory.getAltTotalInformation($scope.customerQuote);	
};
$scope.calculateAlternativeProductsInformation=function(){
console.log("calculateAlternativeProductsInformation")
$scope.getAltSupplierInformation();
$scope.getAltGpInformation();
$scope.getAltTotalInformation();
};
$scope.checkAlternativeAdded=function(){
var count=0;
$rootScope.addedProductCount=0;
if ($scope.customerQuote.productList.length>0) {
angular.forEach($scope.customerQuote.productList, function(value, key){
if (value.altProd) {
if (value.altProd.itemCode){
count++;
$rootScope.addedProductCount=$rootScope.addedProductCount+2;
}
}else{
$rootScope.addedProductCount++;
}
});
}	
if (count>0) {
$scope.isAlternateAdded=true;
$scope.customerQuote.saveWithAlternative=true;
}else{
$scope.isAlternateAdded=false;
}
};
// ======= Quote Calculations <<<<<

// ======= Current Supplier/ Compete Quote >>>>>
$scope.resetCurrentSupplier=function(){
$scope.customerQuote.currentSupplierName=null;
$scope.isCurrentSupplierNameRequired=false;
$scope.customerQuote.productList=angular.copy($scope.addedProductList);
if($scope.customerQuote.productList.length>0){
angular.forEach($scope.customerQuote.productList, function(value, key){
value.currentSupplierPrice=0;
value.currentSupplierTotal=0;
value.currentSupplierGP=0;
value.savings=0;
console.log("value...")
console.log(value)
if (value.altProd) {
value.altProd.currentSupplierPrice=0;
value.altProd.currentSupplierTotal=0;
value.altProd.currentSupplierGP=0;
value.altProd.savings=0;
};
});
$scope.addedProductList=angular.copy($scope.customerQuote.productList);
}
$scope.calculateAllInformation();
};

$scope.showConfirmationWindow=function(){
var previousWindowKeyDown = window.onkeydown;
swal({
title: 'Are you sure?',
text: "Changing compete proposal to 'No' can reset current customer price data to 0 .",
showCancelButton: true,
closeOnConfirm: true,
cancelButtonText:"Cancel",
confirmButtonText:"Confirm"
}, function (isConfirm) {
if (isConfirm) {
$scope.resetCurrentSupplier();
}else{
$scope.customerQuote.competeQuote='Yes';	
} 
});
};

$scope.currentSupplierNameChanged=function(){
if ($scope.customerQuote.currentSupplierName!='') {
$scope.customerQuote.competeQuote='Yes';	
}
if($scope.customerQuote.currentSupplierName==''){
$scope.customerQuote.competeQuote='No';
}
}

$scope.isCurrentSupplierNameRequired=false;
$scope.competeQuoteChanged=function(){
console.log("$scope.customerQuote.competeQuote")
console.log($scope.customerQuote.competeQuote)
if ($scope.customerQuote.competeQuote=='No'){
if ($scope.customerQuote.productList) {
if ($scope.customerQuote.productList.length>0) {
$scope.showConfirmationWindow();	
}else{
$scope.isCurrentSupplierNameRequired=false;
$scope.customerQuote.currentSupplierName="";
}
}else{
$scope.isCurrentSupplierNameRequired=false;
$scope.customerQuote.currentSupplierName="";
}
}
if ($scope.customerQuote.competeQuote=='Yes'){
$scope.isCurrentSupplierNameRequired=true;
}
};
// ======= Current Supplier/ Compete Quote <<<<<

// $scope.initTermsConditionsAndServices=function(){
// 	$rootScope.showSpinner();
// 	// console.log("GetTermsConditions API Request :"+new Date());
// 	SQManageMenuServices.GetTermsConditions();
// };
// $scope.initTermsConditionsAndServices();
// // Get TermsConditions=====================================
// $scope.termConditionList=[];
// $scope.servicesList=[];
// $scope.handleGetTermsConditionsDoneResponse=function(data){
// 	// console.log("GetTermsConditions API Response :"+new Date());	
// 	// console.log(data)
// 	if(data){
// 		if (data.code) {
// 			if(data.code.toUpperCase()=='SUCCESS'){
// 				$scope.termConditionList=data.result;
// 				$scope.termConditionList1=data.result;
// 				$rootScope.showSpinner();
// 				// console.log("GetServices API Request :"+new Date());
// 				SQManageMenuServices.GetServices();

// 			}else{
// 				$rootScope.alertError(data.message);	
// 				$rootScope.hideSpinner();
// 			}
// 		}
// 	}
// };

// var cleanupEventGetTermsConditionsDone = $scope.$on("GetTermsConditionsDone", function(event, message){
// 	$scope.handleGetTermsConditionsDoneResponse(message);      
// });

// var cleanupEventGetTermsConditionsNotDone = $scope.$on("GetTermsConditionsNotDone", function(event, message){
// 	$rootScope.alertServerError("Server error");
// 	$rootScope.hideSpinner();
// });
// // Get Services =================================================
// $scope.handleGetServicesDoneResponse=function(data){
// 	// console.log("GetServices API Response :"+new Date());	
// 	// console.log(data)
// 	if(data){
// 		if (data.code) {
// 			if(data.code.toUpperCase()=='SUCCESS'){
// 				$scope.serviceList=data.result;
// 				$scope.serviceList1=data.result;

// 				// console.log("getProductGroup API Request :"+new Date());
// 				$scope.getProductGroup();
// 			}else{
// 				$rootScope.alertError(data.message);	
// 				$rootScope.hideSpinner();
// 			}
// 		}
// 	}
// };
// var cleanupEventGetServicesDone = $scope.$on("GetServicesDone", function(event, message){
// 	$scope.handleGetServicesDoneResponse(message);      
// });

// var cleanupEventGetServicesNotDone = $scope.$on("GetServicesNotDone", function(event, message){
// 	$rootScope.alertServerError("Server error");
// 	$rootScope.hideSpinner();
// });

// /*==========================GET USER LIST==============================*/
// $scope.handleGetUserListDoneResponse=function(data){
// 	// console.log("GetUserList API Response :"+new Date());	
// 	// console.log(data);
// 	if(data){
// 		if (data.code) {	
// 			if(data.code.toUpperCase()=='SUCCESS'){   
// 				$scope.userList=data.result;
// // console.log($rootScope.userData)
// angular.forEach($scope.userList, function(element, key){
// 	if (element.key==$rootScope.userData.userId && element.value==$rootScope.userData.userName) {
// 		$scope.customerQuote.salesPerson=element;
// 	}
// });
// $rootScope.showSpinner();

// $scope.initQuoteView();
// }else{
// 	$rootScope.alertError(data.message);
// 	$rootScope.hideSpinner();
// }

// }
// }
// };

// var cleanupEventGetUserListDone = $scope.$on("GetUserListDone", function(event, message){
// 	$scope.handleGetUserListDoneResponse(message);      
// });

// var cleanupEventGetUserListNotDone = $scope.$on("GetUserListNotDone", function(event, message){
// 	$rootScope.alertServerError("Server error");
// 	$rootScope.hideSpinner();
// });
/*=============GET CURRENT SUPPLIER LIST==================*/
// $scope.initQuoteView=function(){
// console.log("initQuoteView")
// $window.scrollTo(0,0);	
// $("#customerCode").focus();
// // $rootScope.showSpinner();
// // SQQuoteServices.GetCurrentSupplierList();
// }
// $scope.handleGetCurrentSupplierListDoneResponse=function(data){
// 	// console.log("GetCurrentSupplierList API Response :"+new Date());	
// 	// console.log(data)
// 	if(data){
// 		if (data.code) {
// 			if(data.code.toUpperCase()=='SUCCESS'){
// 				$scope.currentSupplierList=data.result;
// 				$rootScope.showSpinner();
// // SQQuoteServices.GetSalesPersonList();

// // console.log("GetCustomerList API Request :"+new Date());	
// SQManageMenuServices.GetCustomerList();

// }else{
// 	$rootScope.alertError(data.message);
// 	$rootScope.hideSpinner();
// }
// }
// }
// };

// var cleanupEventGetCurrentSupplierListDone = $scope.$on("GetCurrentSupplierListDone", function(event, message){
// 	$scope.handleGetCurrentSupplierListDoneResponse(message);      
// });

// var cleanupEventGetCurrentSupplierListNotDone = $scope.$on("GetCurrentSupplierListNotDone", function(event, message){
// 	$rootScope.alertServerError("Server error");
// 	$rootScope.hideSpinner();
// });

// // =============GET CUSTOMER LIST==================
// $scope.handleGetCustomerListDoneResponse=function(data){
// 	// console.log("GetCustomerList API Response :"+new Date());
// 	// console.log(data)
// 	if(data){
// 		if (data.code) {
// 			if(data.code.toUpperCase()=='SUCCESS'){
// 				$scope.customerList=data.result;
// // console.log($scope.customerList)
// // $rootScope.hideSpinner();
// $rootScope.isQuoteActivated=true;
// // console.log("getProductsList API Request :"+new Date().getTime());
// $scope.getProductsList('');
// }else{
// 	$rootScope.alertError(data.message);
// 	$rootScope.hideSpinner();
// }
// }
// }
// };

// var cleanupEventGetCustomerListDone = $scope.$on("GetCustomerListDone", function(event, message){
// 	$scope.handleGetCustomerListDoneResponse(message);      
// });

// var cleanupEventGetCustomerListNotDone = $scope.$on("GetCustomerListNotDone", function(event, message){
// 	$rootScope.alertServerError("Server error");
// 	$rootScope.hideSpinner();
// });


//Get Product List=====================================
// $scope.getProductsList=function(prod){
// 	$scope.initAuotoComplete();
// }
// $scope.handleGetProductListDoneResponse=function(data){
// if(data){
// 	if (data.code){
// 		if(data.code.toUpperCase()=='SUCCESS'){
// 		// $rootScope.globalProductList=data.result;
// 		$scope.productList=data.result;
// 		$scope.priceArray=[];
// 		$rootScope.isQuoteActivated=true;
// 		// $scope.initAuotoComplete();
// 		$rootScope.hideSpinner();
// 		}else{
// 		$rootScope.hideSpinner();
// 		$rootScope.alertError(data.message);
// 		}
// 		// $rootScope.hideLoadSpinner();
// 		}
// 	}
// };

// var cleanupEventGetProductListDone = $scope.$on("GetProductListDone", function(event, message){
// // console.log("GetProductListDone");
// $scope.handleGetProductListDoneResponse(message);      
// });

// var cleanupEventGetProductListNotDone = $scope.$on("GetProductListNotDone", function(event, message){
// 	$rootScope.alertServerError("Server error");
// 	$rootScope.hideSpinner();
// });



// =====================================




// /*=============GET SALES PERSON LIST==================*/
// $scope.handleGetSalesPersonListDoneResponse=function(data){
// if(data){
// console.log(data)	
// if (data.code) {
// if(data.code.toUpperCase()=='SUCCESS'){
// $scope.salesPersonList=data.result;
// $rootScope.showSpinner();
// SQManageMenuServices.GetCustomerList();

// }else{
// $rootScope.alertError(data.message);
// $rootScope.hideSpinner();
// }
// }
// }
// };

// var cleanupEventGetSalesPersonListDone = $scope.$on("GetSalesPersonListDone", function(event, message){
// $scope.handleGetSalesPersonListDoneResponse(message);      
// });

// var cleanupEventGetSalesPersonListNotDone = $scope.$on("GetSalesPersonListNotDone", function(event, message){
// $rootScope.alertServerError("Server error");
// $rootScope.hideSpinner();
// });








//===== ADD PRODUCT INTO QUOTE >>>>>

$scope.productsDataset=[];
var editProduct={};
$scope.showAddProductModal=function(status,product,index){
console.log(product);
if ($scope.form.addCustomerQuote.$valid) {
$scope.productButtonStatus=status;
$scope.isAddProductModalShow=true;
console.log($scope.productButtonStatus+" product >>>>")
if ($scope.productButtonStatus=='add') {
// $scope.initProducts();
$scope.openMyModal(); 
}else if($scope.productButtonStatus=='edit'){
$scope.editProduct=angular.copy(product);
$scope.editIndex=index;
$scope.openMyModal(); 
}
}else{
$scope.form.addCustomerQuote.submitted=true;		
}
};



$rootScope.addProductToQuote=function(dataFromModal){
console.log("addProductToQuote...");
// console.log(JSON.stringify(dataFromModal));
$scope.dataFromModal=angular.copy(dataFromModal);
$scope.addProduct=dataFromModal.addProduct;
$scope.productButtonStatus=dataFromModal.productButtonStatus;
$scope.isNewProduct=dataFromModal.isNewProduct;
var product;
var altProduct;
product=angular.copy($scope.addProduct);	

if (product) {
if (product.currentSupplierPrice>0 && product.quotePrice>0) {//product.currentSupplierPrice>product.quotePrice
if (product.currentSupplierPrice==product.quotePrice) {
product.savings=0;	
} else{
product.savings=$scope.getPriceInPercentage(product.currentSupplierPrice,product.quotePrice);	
}
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
}
if (product.isLinkedExact) {	
if(product.altProd!=null){
if (product.altProd.currentSupplierPrice>0 && product.altProd.quotePrice>0) {//product.altProd.currentSupplierPrice>product.altProd.quotePrice
if (product.altProd.currentSupplierPrice==product.altProd.quotePrice) {
product.altProd.savings=0;
} else{
product.altProd.savings=$scope.getPriceInPercentage(product.altProd.currentSupplierPrice,product.altProd.quotePrice);	
}
}else{
product.savings=0;	
}
if (product.altProd.currentSupplierPrice>0) {
product.altProd.currentSupplierGP=$scope.getPriceInPercentage(product.altProd.currentSupplierPrice,product.altProd.avgcost);	
}else{
product.altProd.currentSupplierGP=0;	
product.altProd.currentSupplierPrice=0;		
}	
product.altProd.total=product.altProd.itemQty*product.altProd.quotePrice;
product.altProd.currentSupplierTotal=product.altProd.itemQty*product.altProd.currentSupplierPrice;
product.altProd.gpRequired=$scope.getPriceInPercentage(product.altProd.quotePrice,product.altProd.avgcost);
}
}
var newProduct;
if ($scope.isNewProduct) {
console.log("new product.....")
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
'gstFlag':product.gstFlag,
'isLinkedExact':product.isLinkedExact,
'lineComment':product.lineComment,
'isAlternative':'no'
};	
if (product.isLinkedExact) {	
newProduct.altProd=product.altProd;
}
console.log(newProduct)
product=angular.copy(newProduct);
}else{
console.log("existing product>>>>>");
if (product) {
product.isNewProduct=$scope.isNewProduct;
}
}
if ($scope.productButtonStatus=='add') {
// console.log("add product--------")
$scope.addedProductList.push(product);	
$scope.customerQuote.productList=$scope.addedProductList;
$scope.calculateAllInformation();
$scope.checkAlternativeAdded();
// $scope.calculateAlternativeProductsInformation();
};
if ($scope.productButtonStatus=='edit') {
$scope.addedProductList[$scope.editIndex]=product;
$scope.customerQuote.productList=$scope.addedProductList;
$scope.calculateAllInformation();
$scope.checkAlternativeAdded();

// $scope.calculateAlternativeProductsInformation();
};
console.log("$scope.customerQuote.productList")
console.log($scope.customerQuote.productList)
$scope.showAddProductError=false;
};

$scope.deleteProductFromQuote=function(index){
var previousWindowKeyDown = window.onkeydown;
swal({
title: 'Confirm Navigation',
text: "Are you sure you want to delete product ?",
showCancelButton: true,
closeOnConfirm: true,
cancelButtonText:"Cancel",
confirmButtonText:"Confirm"
}, function (isConfirm) {
if (isConfirm) {
// $scope.resetCreateQuote();
if ($scope.addedProductList.length>0) {
$scope.addedProductList.splice(index,1);
$scope.customerQuote.productList=$scope.addedProductList;
$scope.calculateAllInformation();
$scope.checkAlternativeAdded();
}
}
});	
};
//===== ADD PRODUCT INTO QUOTE <<<<<
//===== JSON FOR QUOTE >>>>>
$scope.createAlternativeArray=function(product){
var alternativeArray=[];
// obj.mainProductCode='';
// obj.alternativeProductList=[];
angular.forEach($scope.customerQuote.productList, function(value, key){
if (value.altProd) {
if (value.altProd.itemCode) {
var obj={};
var product={};
product={altProductCode:value.altProd.itemCode, altProductDefaultPrice :0 }
obj.mainProductCode=value.itemCode;
obj.altProductObj=product;
console.log("Array Object ::")
console.log(obj)
alternativeArray.push(obj);
}
}
});
console.log("Alternative Array");
console.log(alternativeArray)
return alternativeArray;
}

var supplierName='';
var supplierId=null;
$scope.jsonToCreateQuote=function(){
var objQuoteBean={};
supplierName='';
supplierId=null;
var salesPerson='';
var salesPersonId=null;
if ($scope.customerQuote.currentSupplierName!=undefined) {
if($scope.customerQuote.currentSupplierName.key){
supplierName=$scope.customerQuote.currentSupplierName.value;
supplierId=$scope.customerQuote.currentSupplierName.key
}else{
if ($scope.customerQuote.currentSupplierName!="") {
supplierName=$scope.customerQuote.currentSupplierName;
supplierId=0;
}else{
supplierName=$scope.customerQuote.currentSupplierName;
supplierId=-1;	
};	
}
}else{
console.log("$scope.customerQuote.currentSupplierName "+$scope.customerQuote.currentSupplierName);
supplierName=$scope.customerQuote.currentSupplierName;
supplierId=-1;
};
if ($scope.customerQuote.salesPerson!=undefined) {
if ($scope.customerQuote.salesPerson.key) {
salesPerson=$scope.customerQuote.salesPerson.value;
salesPersonId=$scope.customerQuote.salesPerson.key;
}
};
var monthlyAvgPurchase=0;
var isNewCustomer='no';
if ($scope.isNewCustomer) {
monthlyAvgPurchase=$scope.customerQuote.monthlyAvgPurchase;
isNewCustomer='yes';
};

objQuoteBean={
'custCode':$scope.customerQuote.customerCode,
'custName':$scope.customerQuote.customerName,
'address':$scope.customerQuote.address,
'email':$scope.customerQuote.email,
'faxNo':$scope.customerQuote.fax,
'phone':$scope.customerQuote.phone,
'monthlyAvgPurchase':monthlyAvgPurchase.toString(),
'isNewCustomer':isNewCustomer,
'quoteAttn':$scope.customerQuote.attn,
'currentSupplierName':supplierName,
'currentSupplierId':supplierId,
'createdDate':moment($scope.customerQuote.createdDate).format('YYYY-MM-DD HH:mm:ss'),
// 'quoteCreatedDate':moment($scope.customerQuote.createDate).format(),
'competeQuote':$scope.customerQuote.competeQuote,
'salesPerson':salesPerson,
'salesPersonId':salesPersonId,
'pricesGstInclude':$scope.customerQuote.pricesGstInclude,
'notes':$scope.customerQuote.notes,
'productList':$scope.customerQuote.productList,
'serviceList':$scope.serviceArray,
'termConditionList':$scope.termConditionArray,
'offerList':$scope.offerArray,

'userId':$rootScope.userData.userId,
}
if ($scope.customerQuote.saveWithAlternative) {
console.log("saveWithAlternative")
objQuoteBean.alternativeArray=$scope.createAlternativeArray();
objQuoteBean.saveWithAlternative=$scope.customerQuote.saveWithAlternative;
}
// console.log(JSON.stringify(objQuoteBean))
// return JSON.stringify(objQuoteBean);
return objQuoteBean;
}
//===== JSON FOR QUOTE <<<<<

//===== CREATE QUOTE API CALL >>>>>
$scope.createQuote=function(){
$log.debug("createQuote call");
if ($scope.form.addCustomerQuote.$valid) {
if ($scope.customerQuote.productList.length>0) {
// isSalesPersonExist=false;
isSupplierExist=false;
angular.forEach($scope.currentSupplierList, function(currentSupplierName, key){
if ($scope.customerQuote.currentSupplierName!=undefined&&$scope.customerQuote.currentSupplierName!=''&&$scope.customerQuote.currentSupplierName!=null) {	
if ($scope.customerQuote.currentSupplierName.key) {
}else{
if ($scope.customerQuote.currentSupplierName.toUpperCase()==currentSupplierName.value.toUpperCase()){
isSupplierExist=true;
}	
}
}		
});
if (isSupplierExist) {//if (isSupplierExist || isSalesPersonExist)
if (isSupplierExist) {
$scope.form.addCustomerQuote.currentSupplierName.$invalid=true;
$('#currentSupplierName').focus();
}else{
$scope.form.addCustomerQuote.currentSupplierName.$invalid=false;
}
}else{
if ($scope.buttonstatus=='add') {
console.log(JSON.stringify($scope.jsonToCreateQuote()));
$rootScope.showSpinner();
SQQuoteServices.CreateQuote(JSON.stringify($scope.jsonToCreateQuote()));
}
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

//CREATE QUOTE RESPONSE >>>>>
function checkQuoteResponse(quoteResponse){
console.log("checkQuoteResponse" +quoteResponse);
if (quoteResponse) {
if (quoteResponse.newCustomerCreated) {
var obj={"code":$scope.customerQuote.customerCode,"key":quoteResponse.genratedCustomerId,"value":$scope.customerQuote.customerCode+" ("+$scope.customerQuote.customerName+")"};
ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.customerList,obj);
} 
if (quoteResponse.newSupplierCreated) {
var obj={"code":supplierName,"key":quoteResponse.genratedSupplierId,"value":supplierName};
ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.supplierList,obj);
} 
if (quoteResponse.newProductCreated) {
	$rootScope.initAuotoComplete();
	$timeout(function() {
	$scope.moveToCustomerInfo();
	}, 2000);
};
};
};

var createQuoteResponse={};
$scope.handleCreateQuoteDoneResponse=function(data){
createQuoteResponse={};	
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
// $rootScope.alertSuccess("Successfully created quote");
console.log("Quote Response ::")
console.log(angular.toJson(data));
createQuoteResponse=data;

checkQuoteResponse(createQuoteResponse);
$scope.resetCreateQuote();

var previousWindowKeyDown = window.onkeydown;	
swal({
		title: "Success",
		text: "Successfully created proposal...!",
		type: "success",
		timer: 2000,
		showConfirmButton: false
		// closeOnConfirm: true,			
	});

if (!data.newProductCreated) {
$rootScope.hideSpinner();
$timeout(function() {
$scope.moveToCustomerInfo();
}, 2000);
};
	
}else{
$rootScope.alertError(data.message);
$rootScope.hideSpinner();
}
}}
};
var cleanupEventQuoteSessionTimeOut = $scope.$on("QuoteSessionTimeOut", function(event, message){
$scope.resetCreateQuote();
$rootScope.$broadcast('SessionTimeOut', message); 		
$rootScope.alertSessionTimeOutOnQuote();
});

var cleanupEventCreateQuoteDone = $scope.$on("CreateQuoteDone", function(event, message){
$scope.handleCreateQuoteDoneResponse(message);      
});

var cleanupEventCreateQuoteNotDone = $scope.$on("CreateQuoteNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

//===================HOTKEYS====================  

hotkeys.bindTo($scope)
.add({
combo: 'ctrl+shift+a',
description: 'Show / hide add product pop-up',
allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
callback: function() {
console.log("isAddProductModalShow");
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
console.log("add next product");
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
console.log("Save");
console.log($scope.isAddProductModalShow);
if ($scope.isAddProductModalShow) {
$rootScope.saveAndClose();
}else{
$scope.createQuote();
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
cleanupEventCreateQuoteDone();
cleanupEventCreateQuoteNotDone();
cleanupEventQuoteSessionTimeOut();
cleanupEventGetCustomerDetailsDone();
cleanupEventGetCustomerDetailsNotDone();
cleanupEventGetProductGroupListDone();
cleanupEventGetProductGroupListNotDone();
$rootScope.isQuoteActivated=false;
});
})

app.directive('shortcut', function() {
return {
restrict: 'E',
replace: true,
scope: true,
link:    function postLink(scope, iElement, iAttrs){
jQuery(document).on('keypress', function(e){
console.log(e)
scope.$apply(scope.keyPressed(e));
});
}
};
});