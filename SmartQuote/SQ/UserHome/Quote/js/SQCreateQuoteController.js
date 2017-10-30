angular.module('sq.SmartQuoteDesktop')
.controller('SQCreateQuoteController',function($uibModal,$scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQUserHomeServices,hotkeys,$http,SQQuoteServices,CalculationFactory){
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

$scope.competeQuote=["Yes","No"];
$scope.customerQuote.competeQuote="No";
$scope.currentSupplierList=[];
$scope.salesPersonList=[];
$scope.userLists=[];


$scope.productList=[];
$scope.isAlternateAdded=false;
$scope.customerQuote.saveWithAlternative=false;

//=======================================
$scope.today = function() {
	$scope.dt = new Date();
	console.log($scope.dt)
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

$scope.initDate();

$scope.quoteDateChanged=function(quoteDate){
// console.log("quoteDateChanged");
// console.log(quoteDate);
// console.log(moment(quoteDate).format());
// console.log(moment(quoteDate).format());
// console.log(moment(quoteDate).format('YYYY-MM-DD,h:mm:ss a'));
};


//initialising Search======================
$scope.initAuotoComplete=function(){
// $scope.selectedProduct=null;
products = new Bloodhound({
	datumTokenizer:function(d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	prefetch: {
		url: "/smartquote/products.json?query=%QUERY",
		cache: false,
		beforeSend: function(xhr){
        $rootScope.showSpinner();
        },
		filter: function (devices) {
			$rootScope.hideSpinner();
			return $.map(devices, function (device) {
				return {
					code: device.code,
					value : device.value
				};
			});
		}
	},
});
products.clearPrefetchCache();
products.initialize();
$rootScope.productsDataset = {
	displayKey: 'value',
	limit: 200,
// async: false,
source: products.ttAdapter(),
};

$rootScope.exampleOptions = {
	displayKey: 'title',
	highlight: true
};

// $timeout(function() {
// 	$rootScope.hideSpinner();
// }, 1000);

};

// ===============UIB MODAL STARTS====================
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
	console.log("dataFromModal");
	console.log(dataFromModal);
//-------------------------------
//-------------------------------
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
	// console.log("GetTermsConditions API Request :"+new Date());
	SQUserHomeServices.GetTermsConditions();
};
$scope.initTermsConditionsAndServices();
// Get TermsConditions=====================================
$scope.termConditionList=[];
$scope.servicesList=[];
$scope.handleGetTermsConditionsDoneResponse=function(data){
	// console.log("GetTermsConditions API Response :"+new Date());	
	// console.log(data)
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				$scope.termConditionList=data.result;
				$scope.termConditionList1=data.result;
				$rootScope.showSpinner();
				// console.log("GetServices API Request :"+new Date());
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
	// console.log("GetServices API Response :"+new Date());	
	// console.log(data)
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				$scope.serviceList=data.result;
				$scope.serviceList1=data.result;

				// console.log("getProductGroup API Request :"+new Date());
				$scope.getProductGroup();
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
/*=============GET PRODUCT GROUP LIST==================*/
$scope.productGroupList=[]
$scope.getProductGroup=function(){
// console.log("getProductGroup")
// $rootScope.showLoadSpinner();
SQUserHomeServices.GetProductGroupList();
};
$scope.handleGetGetProductGroupListDoneResponse=function(data){
	// console.log("getProductGroup API Response :"+new Date());
	// console.log(data)
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				$scope.productGroupList=data.result;
				$rootScope.globalProductGroupList=data.result;
// $scope.openMyModal(); 
// console.log("GetUserList API Request :"+new Date());
SQUserHomeServices.GetUserList();

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
/*==========================GET USER LIST==============================*/
$scope.handleGetUserListDoneResponse=function(data){
	// console.log("GetUserList API Response :"+new Date());	
	// console.log(data);
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

$scope.initQuoteView();
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
/*=============GET CURRENT SUPPLIER LIST==================*/
$scope.initQuoteView=function(){
	console.log("initQuoteView")
	$window.scrollTo(0,0);	
	$("#customerCode").focus();
	$rootScope.showSpinner();
	SQQuoteServices.GetCurrentSupplierList();
}
$scope.handleGetCurrentSupplierListDoneResponse=function(data){
	// console.log("GetCurrentSupplierList API Response :"+new Date());	
	// console.log(data)
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				$scope.currentSupplierList=data.result;
				$rootScope.showSpinner();
// SQQuoteServices.GetSalesPersonList();

// console.log("GetCustomerList API Request :"+new Date());	
SQUserHomeServices.GetCustomerList();

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

/*=============GET CUSTOMER LIST==================*/
$scope.handleGetCustomerListDoneResponse=function(data){
	// console.log("GetCustomerList API Response :"+new Date());
	// console.log(data)
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				$scope.customerList=data.result;
// console.log($scope.customerList)
// $rootScope.hideSpinner();
$rootScope.isQuoteActivated=true;
// console.log("getProductsList API Request :"+new Date().getTime());
$scope.getProductsList('');
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


//Get Product List=====================================
$scope.getProductsList=function(prod){
	$scope.initAuotoComplete();
}
$scope.handleGetProductListDoneResponse=function(data){
	// console.log("getProductsList API Response :"+new Date().getTime());
	// console.log(data)
	if(data){
		if (data.code){
			if(data.code.toUpperCase()=='SUCCESS'){
// $rootScope.globalProductList=data.result;
$scope.productList=data.result;
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

$scope.resetCreateQuote=function(){
$log.debug("resetCreateQuote call");
$scope.customerQuote={};
// $scope.customerQuote.productList=[];
$scope.addedProductList=[];
$scope.isAddProductModalShow=false;
$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
$scope.altSupplierInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.altTotalInformation={'subtotal':0,'gstTotal':0,'total':0};
$scope.altGpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
isSupplierExist=false;
isSalesPersonExist=false;
$scope.isNewCustomer=false;
$scope.customerQuote.competeQuote="No";
$scope.isAlternateAdded=false;
$scope.customerQuote.saveWithAlternative=false;
$scope.serviceList=angular.copy($scope.serviceList1);
$scope.termConditionList=angular.copy($scope.termConditionList1);
$scope.form.addCustomerQuote.submitted=false;
$scope.form.addCustomerQuote.$setPristine();
angular.forEach($scope.userList, function(element, key){
	if (element.key==$rootScope.userData.userId && element.value==$rootScope.userData.userName) {
		$scope.customerQuote.salesPerson=element;
	}
});	
$scope.initDate();
};
$scope.cancelCreateQuote=function(){
// $rootScope.moveToTop();
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

// ===================== ADD PRODUCTS=====================
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
}
$scope.calculateAllInformation();
};
$scope.showConfirmationWindow=function(){
var previousWindowKeyDown = window.onkeydown;
  swal({
  title: 'Are you sure?',
  text: "Changing compete quote to 'no' can reset current customer price data to 0 .",
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


// $scope.productsDataset=[];
// var editProduct={};
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

// ===============CALCULATION===============================

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


//========================================
$scope.executeProductCalculations=function(){
	
}
$scope.executeAltProductCalculations=function(){

}
$rootScope.addProductToQuote=function(dataFromModal){
console.log("addProductToQuote>>>>>....<<<<<<");
console.log(JSON.stringify(dataFromModal));
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
	if ($scope.addedProductList.length>0) {
		$scope.addedProductList.splice(index,1);
		$scope.customerQuote.productList=$scope.addedProductList;
		$scope.calculateAllInformation();
		$scope.checkAlternativeAdded();
		// $scope.calculateAlternativeProductsInformation();
	}else{
	}
};

// ===================== RESET & CANCEL ENDS=====================
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
// $scope.jsonOfProductList=function(customerQuote){
// 	var productList=[];
// 	var product={};
// 	console.log("customerQuote");
// 	console.log(customerQuote);
// 	if (customerQuote.saveWithAlternative) {
// 		angular.forEach(customerQuote.productList, function(value, key){
// 			if (value.altProd) {
// 				if (value.altProd.itemCode) {	
// 					product={
// 						"avgcost":value.altProd.avgcost,
// 						"itemCode": value.altProd.itemCode,
// 						"currentSupplierGP": value.altProd.currentSupplierGP,
// 						"currentSupplierPrice": value.altProd.currentSupplierPrice,
// 						"currentSupplierTotal": value.altProd.currentSupplierTotal,
// 						"itemDescription": value.altProd.itemDescription,
// 						"description2": value.altProd.description2,
// 						"description3": value.altProd.description3,
// 						"gpRequired": value.altProd.gpRequired,
// 						"gstFlag": value.altProd.gstFlag,
// 						"itemQty": value.altProd.itemQty,
// 						"price0exGST": value.altProd.price0exGST,
// 						"price1exGST": value.altProd.price1exGST,
// 						"price2exGST": value.altProd.price2exGST,
// 						"price3exGST": value.altProd.price3exGST,
// 						"price4exGST": value.altProd.price4exGST,
// 						"quotePrice": value.altProd.quotePrice,
// 						"savings": value.altProd.savings,
// 						"total": value.altProd.total,
// 						"unit": value.altProd.unit,
// 					}
// 					productList.push(product);
// 				}
// 			}else{
// 				product={
// 					"avgcost": value.avgcost,
// 					"itemCode": value.itemCode,
// 					"itemDescription": value.itemDescriptione,
// 					"description2": value.description2,
// 					"description3": value.description3,
// 					"currentSupplierGP": value.currentSupplierGP,
// 					"currentSupplierPrice": value.currentSupplierPrice,
// 					"currentSupplierTotal": value.currentSupplierTotal,
// 					"gpRequired": value.gpRequired,
// 					"gstFlag": value.gstFlag,
// 					"isNewProduct": value.isNewProduct,
// 					"itemQty": value.itemQty,
// 					"price0exGST": value.price0exGST,
// 					"price1exGST": value.price1exGST,
// 					"price2exGST": value.price2exGST,
// 					"price3exGST": value.price3exGST,
// 					"price4exGST": value.price4exGST,
// 					"productGroupCode": value.productGroupCode,
// 					"productGroupName": value.productGroupName,
// 					"qtyBreak0": value.qtyBreak0,
// 					"qtyBreak1": value.qtyBreak1,
// 					"qtyBreak2": value.qtyBreak2,
// 					"qtyBreak3": value.qtyBreak3,
// 					"qtyBreak4": value.qtyBreak4,
// 					"quotePrice": value.quotePrice,
// 					"savings": value.savings,
// 					"total": value.total,
// 					"unit": value.unit,
// 					"isLinkedExact": value.isLinkedExact,
// 				}
// 				productList.push(product);	
// 			}
// 		});
// 	}else{
// 		angular.forEach(customerQuote.productList, function(value, key){
// 			product={
// 				"avgcost": value.avgcost,
// 				"itemCode": value.itemCode,
// 				"itemDescription": value.itemDescriptione,
// 				"description2": value.description2,
// 				"description3": value.description3,
// 				"currentSupplierGP": value.currentSupplierGP,
// 				"currentSupplierPrice": value.currentSupplierPrice,
// 				"currentSupplierTotal": value.currentSupplierTotal,
// 				"gpRequired": value.gpRequired,
// 				"gstFlag": value.gstFlag,
// 				"isNewProduct": value.isNewProduct,
// 				"itemQty": value.itemQty,
// 				"price0exGST": value.price0exGST,
// 				"price1exGST": value.price1exGST,
// 				"price2exGST": value.price2exGST,
// 				"price3exGST": value.price3exGST,
// 				"price4exGST": value.price4exGST,
// 				"productGroupCode": value.productGroupCode,
// 				"productGroupName": value.productGroupName,
// 				"qtyBreak0": value.qtyBreak0,
// 				"qtyBreak1": value.qtyBreak1,
// 				"qtyBreak2": value.qtyBreak2,
// 				"qtyBreak3": value.qtyBreak3,
// 				"qtyBreak4": value.qtyBreak4,
// 				"quotePrice": value.quotePrice,
// 				"savings": value.savings,
// 				"total": value.total,
// 				"unit": value.unit,
// 				"isLinkedExact": value.isLinkedExact,
// 			}
// 			productList.push(product);
// 		});
// 	}
// 	return productList;
// };
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
		// 'productList':$scope.jsonOfProductList($scope.customerQuote),
		'serviceList':$scope.serviceList,
		'termConditionList':$scope.termConditionList,
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

$scope.createQuote=function(){
	$log.debug("createQuote call");
	if ($scope.form.addCustomerQuote.$valid) {
		if ($scope.customerQuote.productList.length>0) {
			isSalesPersonExist=false;
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
		SQQuoteServices.CreateQuote(JSON.stringify($scope.jsonToCreateQuote()));
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
					// $scope.cancelCreateQuote();
					$scope.resetCreateQuote();
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
// $scope.cancelCreateQuote();
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
	cleanupEventGetCustomerDetailsDone();
	cleanupEventGetCustomerDetailsNotDone();
	cleanupEventGetCustomerListDone();
	cleanupEventGetCustomerListNotDone();
	// cleanupEventGetProductListDone();
	// cleanupEventGetProductListNotDone();
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