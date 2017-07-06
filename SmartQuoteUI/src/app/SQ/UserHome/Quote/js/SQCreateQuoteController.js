angular.module('sq.SmartQuoteDesktop')
.controller('SQCreateQuoteController',['$uibModal','$scope','$rootScope','$window','$anchorScroll','$log','$state','$timeout','SQUserHomeServices','hotkeys', function($uibModal,$scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQUserHomeServices,hotkeys){
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
var isSalesPersonExist=false;

$scope.isAddProductModalShow=false;


$scope.competeQuote=["yes","no"];
$scope.customerQuote.competeQuote="no";
$scope.currentSupplierList=[];
$scope.salesPersonList=[];
$scope.userLists=[];


$scope.productList=[];

//initialising Search======================

$scope.initAuotoComplete=function(){
	// $scope.selectedProduct=null;
	 products = new Bloodhound({
	    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.value); },
	    queryTokenizer: Bloodhound.tokenizers.whitespace,
	    local: $scope.productList
	  });
        products.initialize();
        $rootScope.productsDataset = {
          displayKey: 'value',
          limit: 200,
          async: false,
          source: products.ttAdapter(),
        };
        $rootScope.exampleOptions = {
          displayKey: 'title',
          highlight: true
        };
}

// ===============UIB MODAL STARTS====================
$scope.animationsEnabled=true;
$scope.openMyModal = function (product) {
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
		// 'productList':$scope.productList,
		'productGroupList':$scope.productGroupList,
		'isAddProductModalShow':$scope.isAddProductModalShow,
		}
	}else if ($scope.productButtonStatus=='edit') {
		console.log("$scope.editProduct")
		console.log($scope.editProduct)
		dataToModal={
		'quoteStatus':'create',
		'productButtonStatus':$scope.productButtonStatus,
		'customerQuote':$scope.customerQuote,
		// 'productList':$scope.productList,
		'productGroupList':$scope.productGroupList,
		'isAddProductModalShow':$scope.isAddProductModalShow,
		'product':$scope.editProduct,
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


// ===============UIB MODAL ENDS======================

$scope.initTermsConditionsAndServices=function(){
$rootScope.showSpinner();
console.log("GetTermsConditions API Request :"+new Date());
SQUserHomeServices.GetTermsConditions();
};
$scope.initTermsConditionsAndServices();
// Get TermsConditions=====================================
$scope.termConditionList=[];
$scope.servicesList=[];
$scope.handleGetTermsConditionsDoneResponse=function(data){
console.log("GetTermsConditions API Response :"+new Date());	
console.log(data)
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
$scope.termConditionList=data.result;
$scope.termConditionList1=data.result;
$rootScope.showSpinner();
console.log("GetServices API Request :"+new Date());
SQUserHomeServices.GetServices();

}else{
$rootScope.alertError(data.message);	
$rootScope.hideSpinner();
}
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
// Get Services =================================================
$scope.handleGetServicesDoneResponse=function(data){
console.log("GetServices API Response :"+new Date());	
console.log(data)
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
$scope.serviceList=data.result;
$scope.serviceList1=data.result;
$scope.initQuoteView();
}else{
$rootScope.alertError(data.message);	
$rootScope.hideSpinner();
}
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
/*=============GET CURRENT SUPPLIER LIST==================*/
$scope.initQuoteView=function(){
$rootScope.showSpinner();
console.log("GetCurrentSupplierList API Request :"+new Date());
SQUserHomeServices.GetCurrentSupplierList();
}
$scope.handleGetCurrentSupplierListDoneResponse=function(data){
console.log("GetCurrentSupplierList API Response :"+new Date());	
console.log(data)
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
	$scope.currentSupplierList=data.result;
	$rootScope.showSpinner();
    // SQUserHomeServices.GetSalesPersonList();
    console.log("GetUserList API Request :"+new Date());
    SQUserHomeServices.GetUserList();

}else{
$rootScope.alertError(data.message);
$rootScope.hideSpinner();
}
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
 console.log("GetUserList API Response :"+new Date());	
 console.log(data);
if(data){
if (data.code) {	
  if(data.code.toUpperCase()=='SUCCESS'){   
	$scope.userList=data.result;
	// console.log($rootScope.userData)
	angular.forEach($scope.userList, function(element, key){
		if (element.key==$rootScope.userData.userId && element.value==$rootScope.userData.userName) {
			$scope.customerQuote.salesPerson=element;
		}
	});
	$rootScope.showSpinner();
	console.log("GetCustomerList API Request :"+new Date());	
    SQUserHomeServices.GetCustomerList();
	}else{
	$rootScope.alertError(data.message);
	$rootScope.hideSpinner();
	}
 
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
/*=============GET CUSTOMER LIST==================*/
$scope.handleGetCustomerListDoneResponse=function(data){
console.log("GetCustomerList API Response :"+new Date());
console.log(data)
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
$scope.customerList=data.result;
// console.log($scope.customerList)
// $rootScope.hideSpinner();
console.log("getProductGroup API Request :"+new Date());
$scope.getProductGroup();
}else{
$rootScope.alertError(data.message);
$rootScope.hideSpinner();
}
}
}
};

var cleanupEventGetCustomerListDone = $scope.$on("GetCustomerListDone", function(event, message){
$scope.handleGetCustomerListDoneResponse(message);      
});

var cleanupEventGetCustomerListNotDone = $scope.$on("GetCustomerListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*=============GET PRODUCT GROUP LIST==================*/
$scope.productGroupList=[]
$scope.getProductGroup=function(){
	// console.log("getProductGroup")
	// $rootScope.showLoadSpinner();
	SQUserHomeServices.GetProductGroupList();
};
$scope.handleGetGetProductGroupListDoneResponse=function(data){
console.log("getProductGroup API Response :"+new Date());
console.log(data)
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
$scope.productGroupList=data.result;
$rootScope.globalProductGroupList=data.result;
// $scope.openMyModal(); 
console.log("getProductsList API Request :"+new Date().getTime());
$scope.getProductsList('');
}else{
$rootScope.hideSpinner();
$rootScope.alertError(data.message);
}
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

//Get Product List=====================================
$scope.getProductsList=function(prod){
	// $rootScope.showSpinner();
	var prodLike=prod;
	SQUserHomeServices.GetProductList(prodLike);
}
$scope.handleGetProductListDoneResponse=function(data){
console.log("getProductsList API Response :"+new Date().getTime());
console.log(data)
if(data){
if (data.code){
if(data.code.toUpperCase()=='SUCCESS'){
	$scope.productList=data.result;
	$rootScope.globalProductList=data.result;
	$scope.priceArray=[];
	// console.log("JSON Product List >")
	// console.log(JSON.stringify($scope.productList));
	// $scope.getProductGroup();
	$rootScope.isQuoteActivated=true;
	$scope.initAuotoComplete();
	
	$rootScope.hideSpinner();
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



// =====================================

$scope.customerCodeChanged=function(code){
// console.log("customerCodeChanged")
// console.log(code)
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
$scope.customerQuote.customerCode=code;
}else{
$scope.getCustomerDetails(customerCode);
}
// console.log("$scope.isNewCustomer  "+$scope.isNewCustomer)
};


/*=============GET SALES PERSON LIST==================*/
$scope.handleGetSalesPersonListDoneResponse=function(data){
if(data){
console.log(data)	
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
	$scope.salesPersonList=data.result;
	$rootScope.showSpinner();
    SQUserHomeServices.GetCustomerList();

}else{
$rootScope.alertError(data.message);
$rootScope.hideSpinner();
}
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



/*===================GET CUSTOMER DETAILS=================*/
$scope.assignCustomerDetails=function(data){
var address='';
address=data.address1;
console.log("asssigning data to customer")
$scope.customerQuote.customerCode=data.customerCode;
$scope.customerQuote.customerName=data.customerName;
$scope.customerQuote.address=data.address;
$scope.customerQuote.phone=data.phone;
$scope.customerQuote.email=data.email;
$scope.customerQuote.fax=data.fax;

};

$scope.getCustomerDetails=function(customer){
// console.log(customer);
$rootScope.showSpinner();
SQUserHomeServices.GetCustomerDetails(customer.code);
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

// ===================== RESET & CANCEL=====================
$scope.cancelCreateQuote=function(){
$rootScope.moveToTop();
$("#customerCode").focus();
$log.debug("cancelCreateQuote call");
$scope.customerQuote={};
// $scope.customerQuote.productList=[];
$scope.addedProductList=[];
$scope.isAddProductModalShow=false;
$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
isSupplierExist=false;
isSalesPersonExist=false;
$scope.isNewCustomer=false;
$scope.customerQuote.competeQuote="no";
$scope.serviceList=angular.copy($scope.serviceList1);
$scope.termConditionList=angular.copy($scope.termConditionList1);
$scope.form.addCustomerQuote.submitted=false;
$scope.form.addCustomerQuote.$setPristine();
angular.forEach($scope.userList, function(element, key){
	if (element.key==$rootScope.userData.userId && element.value==$rootScope.userData.userName) {
		$scope.customerQuote.salesPerson=element;
	}
});
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

$scope.isCurrentSupplierNameRequired=false;
$scope.competeQuoteChanged=function(){
console.log($scope.customerQuote.competeQuote)
if ($scope.customerQuote.competeQuote=='no'){
$scope.customerQuote.currentSupplierName=null;
// $scope.addedProductList=[];
$scope.isCurrentSupplierNameRequired=false;
$scope.customerQuote.productList=angular.copy($scope.addedProductList);
if($scope.customerQuote.productList.length>0){
	angular.forEach($scope.customerQuote.productList, function(value, key){
		value.currentSupplierPrice=0;
		value.currentSupplierTotal=0;
		value.currentSupplierGP=0;
		value.savings=0;
	});
}
$scope.calculateAllInformation();
// $scope.customerQuote.currentSupplierName=undefined;
}
if ($scope.customerQuote.competeQuote=='yes'){
$scope.isCurrentSupplierNameRequired=true;
}
};
// $scope.isCurrentSupplierNameRequired=function(){
// 	if ($scope.customerQuote.competeQuote=='no'){
// 	return false;
// 	}
// 	if ($scope.customerQuote.competeQuote=='yes'){
// 	return true;
// 	}
// }


// $scope.productsDataset=[];
$scope.showAddProductModal=function(status,product,index){
if ($scope.form.addCustomerQuote.$valid) {
	$scope.productButtonStatus=status;
	$scope.isAddProductModalShow=true;
	console.log($scope.productButtonStatus+" product >>>>")
	if ($scope.productButtonStatus=='add') {
	    // $scope.initProducts();
	    $scope.openMyModal(); 
	}else if($scope.productButtonStatus=='edit'){
		console.log("edit")
		// console.log(product)
		// $scope.getProductGroup();
		$scope.editProduct=angular.copy(product);
		$scope.editIndex=index;
		$scope.openMyModal(); 
		// console.log("===========")
		// console.log($scope.editProduct)
	}
}else{
	$scope.form.addCustomerQuote.submitted=true;		
}
};


// ===============CALCULATION===============================


$scope.getPriceInPercentage=function(price,cost){
var val;
val=((price-cost)/price)*100;
return val.toFixed(2);
};





$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getSupplierInformation=function(){
// console.log("getSupplierInformation")
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
	// console.log($scope.supplierInformation)
}else{
	$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
}
};
$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.getTotalInformation=function(){
// console.log("getSupplierInformation")
var subtotal=0;
var gstTotal=0;
if ($scope.customerQuote.productList.length>0) {
	angular.forEach($scope.customerQuote.productList, function(value, key){
		subtotal=subtotal+parseFloat(value.total);
		// console.log(value);
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
// console.log("getSupplierInformation")
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
	// console.log(gpRequiredSubtotal,countGpRequired);
	$scope.gpInformation.avgGpRequired=gpRequiredSubtotal/countGpRequired;
	// console.log(currentSupplierGPSubtotal,countcurrentSupplierGP);
	$scope.gpInformation.avgCurrentSupplierGp=currentSupplierGPSubtotal/countcurrentSupplierGP;
	// console.log($scope.gpInformation)
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



$rootScope.addProductToQuote=function(dataFromModal){
console.log("addProductToQuote>>>>>....<<<<<<")
console.log(dataFromModal)
$scope.addProduct=dataFromModal.addProduct;
$scope.productButtonStatus=dataFromModal.productButtonStatus;
$scope.isNewProduct=dataFromModal.isNewProduct;
var product;
product=angular.copy($scope.addProduct);
// console.log("product")
// console.log(product)
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
	console.log("new product>>>>>")
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
	 console.log("existing product>>>>>")
	product.isNewProduct=$scope.isNewProduct;
	// product.itemDescription=encodeURIComponent(product.itemDescription)
}
if ($scope.productButtonStatus=='add') {
	console.log("add product--------")
		$scope.addedProductList.push(product);	
	$scope.customerQuote.productList=$scope.addedProductList;
		$scope.calculateAllInformation();
};
	if ($scope.productButtonStatus=='edit') {
		console.log("edit product-------")
		$scope.addedProductList[$scope.editIndex]=product;
		$scope.customerQuote.productList=$scope.addedProductList;
		$scope.calculateAllInformation();
	};
	// console.log(JSON.stringify(product));
console.log("$scope.customerQuote.productList")
console.log($scope.customerQuote.productList)
$scope.showAddProductError=false;

};

$scope.deleteProductFromQuote=function(index){
if ($scope.addedProductList.length>0) {
$scope.addedProductList.splice(index,1);
$scope.customerQuote.productList=$scope.addedProductList;
$scope.calculateAllInformation();

}else{
}
};

// ===================== RESET & CANCEL ENDS=====================

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
// else{
// salesPerson=$scope.customerQuote.salesPerson;
// salesPersonId=0;
// }
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
'competeQuote':$scope.customerQuote.competeQuote,
'salesPerson':salesPerson,
'salesPersonId':salesPersonId,
'pricesGstInclude':$scope.customerQuote.pricesGstInclude,
'notes':$scope.customerQuote.notes,
'productList':$scope.customerQuote.productList,
'serviceList':$scope.serviceList,
'termConditionList':$scope.termConditionList,
'userId':$rootScope.userData.userId,
}
// console.log(JSON.stringify(objQuoteBean))
// return JSON.stringify(objQuoteBean);
return objQuoteBean;
}

$scope.createQuote=function(){
$log.debug("createQuote call");
if ($scope.form.addCustomerQuote.$valid) {
	if ($scope.customerQuote.productList.length>0) {
		isSalesPersonExist=false;
		isSupplierExist=false;
		angular.forEach($scope.currentSupplierList, function(currentSupplierName, key){
			if ($scope.customerQuote.currentSupplierName!=undefined) {	
				if ($scope.customerQuote.currentSupplierName.key) {
				}else{
				if ($scope.customerQuote.currentSupplierName.toUpperCase()==currentSupplierName.value.toUpperCase()){
					isSupplierExist=true;
					}	
				}
			}		
		});
		// angular.forEach($scope.salesPersonList, function(salesPerson, key){
		// 	if ($scope.customerQuote.salesPerson!=undefined) {	
		// 	if ($scope.customerQuote.salesPerson.key) {
		// 	}else{
		// 	if ($scope.customerQuote.salesPerson.toUpperCase()==salesPerson.value.toUpperCase()){
		// 		isSalesPersonExist=true;
		// 	}	
		// 	}
		// 	}
		// });
		// $log.debug("valid form");
		if (isSupplierExist) {//if (isSupplierExist || isSalesPersonExist)
			if (isSupplierExist) {
				$scope.form.addCustomerQuote.currentSupplierName.$invalid=true;
				$('#currentSupplierName').focus();
			}else{
				$scope.form.addCustomerQuote.currentSupplierName.$invalid=false;
			}
			// if (isSalesPersonExist) {
			// 	$('#salesPerson').focus();
			// 	$scope.form.addCustomerQuote.salesPerson.$invalid=true;
			// }else{
			// 	$scope.form.addCustomerQuote.salesPerson.$invalid=false;
			// }
		}else{
		if ($scope.buttonstatus=='add') {
			 console.log(JSON.stringify($scope.jsonToCreateQuote()));
			 $rootScope.showSpinner();
			 SQUserHomeServices.CreateQuote(JSON.stringify($scope.jsonToCreateQuote()));
		}
		}
	}else{
		$log.debug("please add products");
		// $rootScope.alertError("please add products before save")
		$scope.showAddProductError=true;
		$('#addProductLink').focus();
	}
}else{
$log.debug("invalid form");
// $('#customerPanel').focus();
$rootScope.moveToTop();
$scope.form.addCustomerQuote.submitted=true;
}
};
$scope.handleCreateQuoteDoneResponse=function(data){
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
	$rootScope.alertSuccess("Successfully created quote");
	$timeout(function() {
	$scope.cancelCreateQuote();
	$scope.initQuoteView();	
	}, 2000);
	  
}else{
	$rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}}
};
var cleanupEventCreateQuoteDone = $scope.$on("QuoteSessionTimeOut", function(event, message){
// $scope.handleCreateQuoteDoneResponse(message);      
$scope.cancelCreateQuote();
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
cleanupEventGetCustomerDetailsDone();
cleanupEventGetCustomerDetailsNotDone();
cleanupEventGetCustomerListDone();
cleanupEventGetCustomerListNotDone();
cleanupEventGetProductListDone();
cleanupEventGetProductListNotDone();
cleanupEventGetProductGroupListDone();
cleanupEventGetProductGroupListNotDone();
$rootScope.isQuoteActivated=false;
});
}])

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