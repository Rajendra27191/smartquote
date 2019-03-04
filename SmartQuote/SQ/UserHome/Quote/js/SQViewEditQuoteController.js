angular.module('sq.SmartQuoteDesktop')
.controller('SQViewEditQuoteController',function($uibModal,$scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQManageMenuServices,SQManageMenuServices,hotkeys,$http,SQQuoteServices,CalculationFactory,ArrayOperationFactory,DTOptionsBuilder, DTColumnDefBuilder,$filter){
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

$scope.competeQuote=["Yes","No"];
$scope.currentSupplierList=[];
// $scope.salesPersonList=[];
// $scope.userList=[];
$scope.isAlternateAdded=false;
$rootScope.addedProductCount=0;

if ($rootScope.userData) {
  if ($rootScope.userData.userType.toLowerCase()=="admin") {
	$scope.disableSalesPersonSelect=false;
	$scope.isAdmin=true;
  }else{
	$scope.disableSalesPersonSelect=true;
	$scope.isAdmin=false;
  }
};
//======= Date Control >>>>>
$scope.popup1={};
$scope.popup2={};
$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = "dd-MM-yyyy";//$scope.formats[1];
$scope.today = function() {
	// console.log($scope.dt)
	$scope.dt = new Date();
	return $scope.dt;
};
$scope.open1 = function() {
$scope.popup1.opened = true;
};
$scope.open2 = function () {
$scope.popup2.opened = true;
};

$scope.initDate=function(){
$scope.dateOptions = {
formatYear: 'yy',
startingDay: 1,
showWeeks: false
};
if ($scope.customerQuote.modifiedDate===null||$scope.customerQuote.modifiedDate==="null" || $scope.customerQuote.modifiedDate ==="") {
    $scope.customerQuote.modefiedDate = $scope.today();
} else{
	$scope.customerQuote.modefiedDate = new Date($scope.customerQuote.modifiedDate);
};
// console.log($scope.customerQuote)
};

$scope.initCloseDate=function(){
$scope.closeDateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                showWeeks: false,
                minDate:$scope.customerQuote.modefiedDate,
};
if ($scope.customerQuote.closeDate===null|| $scope.customerQuote.closeDate ==="null" || $scope.customerQuote.closeDate ==="") {
	// var currentDate = $scope.today();
	// $scope.customerQuote.closeDate =  new Date(currentDate.getFullYear(),currentDate.getMonth()+1,currentDate.getDate());;
} else{
	$scope.customerQuote.closeDate=new Date($scope.customerQuote.closeDate);
};

};

$scope.validateDate=function(dateFrom,dateTo){
$scope.todayDate = new Date();	
console.log("validateDate", dateTo>dateFrom&&dateTo>$scope.todayDate)
// console.log(dateFrom)
// console.log(dateTo)
if(dateFrom&&dateTo){
console.log($scope.todayDate)
if (dateTo>dateFrom && dateTo>$scope.todayDate) {
$scope.dateInvalid=false;
}else{
$scope.dateInvalid=true;
}
}
};
$scope.setMinCloseDate = function() {
    $scope.closeDateOptions.minDate = $scope.customerQuote.modefiedDate;
};
$scope.quoteDateChanged = function (dateFrom,dateTo) {
$scope.setMinCloseDate();
$scope.validateDate(dateFrom,dateTo);
};

$scope.closeDateChanged = function (dateFrom,dateTo) {
$scope.validateDate(dateFrom,dateTo);
};

// $rootScope.getFormattedDate=function(date){
// var dt = new Date(date);
// var fDate= moment(dt).format("DD-MM-YYYY");
// return fDate;
// };

//======= Date Control <<<<<

//===== Search Product Text Box >>>>>
// $scope.initAuotoComplete=function(){
// console.log("initAuotoComplete...");
// var timestamp = new Date().getTime();
// products = new Bloodhound({
// 	datumTokenizer:function(d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
// 	queryTokenizer: Bloodhound.tokenizers.whitespace,
// 	prefetch: {
// 		url: $rootScope.projectName+"/products.json?"+timestamp,
// 		cache: false,
// 		beforeSend: function(xhr){
//         $rootScope.showSpinner();
//         },
// 		filter: function (devices) {
// 			$rootScope.hideSpinner();
// 			return $.map(devices, function (device) {
// 				return {
// 					code: device.code,
// 					value : device.value
// 				};
// 			});
// 		}
// 	},
// });
// products.clearPrefetchCache();
// products.initialize();
// $rootScope.productsDataset = {
// 	displayKey: 'value',
// 	limit: 200,
// // async: false,
// source: products.ttAdapter(),
// };
// $rootScope.exampleOptions = {
// 	displayKey: 'title',
// 	highlight: true
// };
// };
// $scope.dataTableOpt = {
//    //custom datatable options 
//   // or load data through ajax call also
//   "aLengthMenu": [[10, 50, 100,-1], [10, 50, 100,'All']],
//   };

//===== ADD PRODUCT UIB MODAL >>>>>
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
			'quoteStatus':'edit',
			'productButtonStatus':$scope.productButtonStatus,
			'customerQuote':$scope.customerQuote,
			// 'productList':$scope.productList,
			'productGroupList':$scope.productGroupList,
			'isAddProductModalShow':$scope.isAddProductModalShow,
			// 'addedProductCount': $scope.addedProductCount
			}
		}else if ($scope.productButtonStatus=='edit') {
			dataToModal={
			'quoteStatus':'edit',
			'productButtonStatus':$scope.productButtonStatus,
			'customerQuote':$scope.customerQuote,
			// 'productList':$scope.productList,
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
	modalInstance1.result.then(function (dataFromModal) {
	console.log("dataFromModal");
	console.log(dataFromModal);
	if (dataFromModal.addNextProduct.toLowerCase()=="addnextproduct") {
		// $scope.addProductToQuote(dataFromModal);
		// $scope.isAddProductModalShow=true;
		// $scope.openMyModal();
	}else if(dataFromModal.addNextProduct.toLowerCase()=="saveclose"){
	$rootScope.addProductToEditQuote(dataFromModal);
	$scope.isAddProductModalShow=false;
	}else if(dataFromModal.addNextProduct.toLowerCase()=="sessiontimeout"){
	console.log("Session time out update quote >>")
	$scope.isAddProductModalShow=false;
	$scope.updateQuote();
	}
	}, function () {
	$log.info('Modal dismissed at: ' + new Date());
	$scope.isAddProductModalShow=false;
	});

};
//===== ADD PRODUCT UIB MODAL <<<<<
//===== INIT DATA TABLE >>>>>
$scope.arrangeDataTable=function(){
$scope.dtOptions= DTOptionsBuilder.newOptions().withOption('stateSave', true);;
    // .withOption('order', [0, 'desc']);
    // .withOption('stateSave', true);
				  // .withOption('lengthMenu', [50, 100, 150, 200])
				  // .withDisplayLength(2);
    $scope.dtColumnDefs = [	
    	DTColumnDefBuilder.newColumnDef([2]).withOption('type', 'date-euro'),	
    	DTColumnDefBuilder.newColumnDef([7]).withOption('type', 'date-euro'),	
    	DTColumnDefBuilder.newColumnDef([8]).withOption('type', 'date-euro'),	
    ];
};
//===== initViewEditQuote() >>>>>
$scope.initViewEditQuote=function(){
console.log("initViewEditQuote...")
$rootScope.showSpinner();
SQQuoteServices.GetQuoteView();
};
$scope.initViewEditQuote();
$scope.arrangeDataTable();
$scope.handleGetQuoteViewDoneResponse=function(data){
$scope.quoteListView=[];
if(data){
// console.log(data)
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
 	$scope.quoteListView=data.result;
 	// $rootScope.showSpinner();
	// SQManageMenuServices.GetServices();
}else{
  $rootScope.alertError(data.message);
}
}
$rootScope.hideSpinner();
}
};

var cleanupEventGetQuoteViewDone = $scope.$on("GetQuoteViewDone", function(event, message){

$scope.handleGetQuoteViewDoneResponse(message);      
});

var cleanupEventGetQuoteViewNotDone = $scope.$on("GetQuoteViewNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

//===== Select Rows & Changed Status >>>>>
$scope.selectedRows = [];
$scope.select = function(item,event) {
// console.log(event)
if (!$scope.disableSalesPersonSelect) {
if (event.ctrlKey) {
item.selected ? item.selected = false : item.selected = true;	
} 
};	
}

$scope.getAllSelectedRows = function() {
$scope.selectedRows = [];	
var selectedRows = $filter("filter")($scope.quoteListView, {
  selected: true
}, true);
angular.forEach(selectedRows, function(value, key){
	var quote={quoteId:value.quoteId};
	$scope.selectedRows.push(quote);
});
console.log("$scope.selectedRows : "+$scope.selectedRows.length)
};
$scope.JsonToChangeStatus=function(status){
var objQuoteBean={};
objQuoteBean.objQuoteBeanList=$scope.selectedRows;
objQuoteBean.quoteStatus=status;
return angular.toJson(objQuoteBean);
}

$scope.changeQuoteStatus=function(status){
if (status) {
	$scope.getAllSelectedRows();
	if ($scope.selectedRows.length>0) {
	if (status.toLowerCase()=='won') {
		console.log($scope.getAllSelectedRows())
		$rootScope.showSpinner();
		SQQuoteServices.changeQuoteStatus($scope.JsonToChangeStatus('won'));
	};
	if (status.toLowerCase()=='lost') {
		$rootScope.showSpinner();
		SQQuoteServices.changeQuoteStatus($scope.JsonToChangeStatus('lost'));	
	};
	if (status.toLowerCase()=='closed') {
		$rootScope.showSpinner();
		SQQuoteServices.changeQuoteStatus($scope.JsonToChangeStatus('closed'));	
	};
	} else{
	$rootScope.alertError("Please select quote to change status");	
	};
};
};

$scope.handleChangeQuoteStatusDone=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
   $scope.initViewEditQuote();
   $rootScope.alertSuccess("Successfully changed status");
   // $state.reload();
}else{
  $rootScope.alertError(data.message);
$rootScope.hideSpinner();
}
}
}
};

var cleanupEventChangeQuoteStatusDone = $scope.$on("ChangeQuoteStatusDone", function(event, message){
$scope.handleChangeQuoteStatusDone(message);      
});

var cleanupEventChangeQuoteStatusNotDone = $scope.$on("ChangeQuoteStatusNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});


// ===== INIT() CreateQuote >>>>>>
function setUserAsSalesPerson () {
angular.forEach($rootScope.userList, function(element, key){
if (element.key==quote.salesPersonId && element.value==quote.salesPerson) {
console.log("equal")
$scope.customerQuote.salesPerson=element;
}
});
}

// ======= INIT() EDIT Quote <<<<<<
var quote;
$scope.initEditQuote=function(quote1){
console.log("initEditQuote")
quote=quote1;
$rootScope.showSpinner();
SQQuoteServices.GetTermsAndServiceList(quote.quoteId);
};
// ========= GetTermsAndServiceList of selected Quote
$scope.handleGetTermsAndServiceListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
 	$scope.selectedTermConditionList=data.result.termConditionList;
 	$scope.selectedServiceList=data.result.serviceList;
 	$scope.selectedOfferList=data.result.offerList;
	$scope.getProductsGroupList();
}else{
  $rootScope.hideSpinner();
  $rootScope.alertError(data.message);
}
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
$scope.checkSelectedServices=function(){
console.log("checkSelectedServices")
if ($scope.selectedServiceList!='' && $scope.serviceArray!='') {
for (var j =0; j<$scope.selectedServiceList.length; j++) {
var array=$scope.serviceArray;
objIndex = array.findIndex((obj => obj.key == $scope.selectedServiceList[j].key));
// console.log(array[objIndex])
array[objIndex].code = true;
}	
}
};
$scope.checkSelectedTermsAndCondition=function(){
console.log("checkSelectedTermsAndCondition")
if ($scope.selectedTermConditionList!='' && $scope.termConditionArray!='') {
for (var j =0; j<$scope.selectedTermConditionList.length; j++) {
var array=$scope.termConditionArray;
objIndex = array.findIndex((obj => obj.key == $scope.selectedTermConditionList[j].key));
// console.log(array[objIndex])
array[objIndex].code = true;
}
}
};
$scope.checkSelectedOffers=function(){
console.log("checkSelectedOffers")
console.log($scope.selectedOfferList)
if ($scope.selectedOfferList!='' && $scope.offerArray!='') {
for (var j =0; j<$scope.selectedOfferList.length; j++) {
// console.log("checkSelectedOffers loop :"+j)	
var array=$scope.offerArray;
objIndex = array.findIndex((obj => obj.id == $scope.selectedOfferList[j].id));
array[objIndex].code = true;
}
}
$timeout(function() {
$rootScope.hideSpinner();
}, 1000);

};
// =====================getProductsList=======
$scope.productGroupList=[];
$scope.getProductsGroupList=function(){
	console.log("getProductsGroupList");
	$rootScope.showSpinner();
	SQManageMenuServices.GetProductGroupList();
}

$scope.getQuoteDetails=function(){
console.log("getQuoteDetails");
//From local storage >>>>>
setUserAsSalesPerson();
$scope.currentSupplierList=angular.copy($rootScope.supplierList);	
$scope.termConditionArray=angular.copy($rootScope.termConditionList);
// $scope.termConditionList1=angular.copy($rootScope.termConditionList);
$scope.serviceArray=angular.copy($rootScope.serviceList);
// $scope.serviceList1=angular.copy($rootScope.serviceList);
$scope.offerArray=angular.copy($rootScope.offerList);
// $scope.offerList1=angular.copy($rootScope.offerList);
//From local storage <<<<<
$scope.calculateAllInformation();
$scope.checkAlternativeAdded();
$rootScope.isQuoteActivated=true;
$scope.initDate();

// $rootScope.showSpinner();
$scope.checkSelectedTermsAndCondition();
$scope.checkSelectedServices();
$scope.checkSelectedOffers();
// $scope.initAuotoComplete();
};

$scope.handleGetGetProductGroupListDoneResponse=function(data){
	console.log(data)
	if(data){
	if (data.code) {
	if(data.code.toUpperCase()=='SUCCESS'){
	$scope.productGroupList=data.result;
	$scope.getQuoteDetails();
	}else{
	$rootScope.hideSpinner();
    $rootScope.alertError(data.message);
	}
	}
	}
	// $rootScope.hideSpinner();
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
//========================================================
// /*=============GET SALES PERSON LIST==================*/
// $scope.handleGetSalesPersonListDoneResponse=function(data){
// if(data){
// // console.log(data)	
// if (data.code) {
//   if(data.code.toUpperCase()=='SUCCESS'){
//  	$scope.salesPersonList=data.result;
//  	// $rootScope.showSpinner();
// 	SQQuoteServices.GetTermsAndServiceList(quote.quoteId);
// }else{
//   $rootScope.alertError(data.message);
// }
// // $rootScope.hideSpinner();
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




$scope.closeEditProduct=function(){
console.log("closeEditProducts");
};

$scope.viewDetailInformation=function(quote){
	console.log("viewDetailInformation");
	console.log(quote);
	// $rootScope.showSpinner();
	var currentQuote=angular.copy(quote);
	// var dt = new Date(currentQuote.createdDate);
	// console.log("date ::: ",dt)
	$scope.showEditQuoteView=true;
	if (currentQuote.competeQuote.toUpperCase=='NO') {
	$scope.isCurrentSupplierNameRequired=false;
	}else if (currentQuote.competeQuote.toUpperCase=='YES') {
	$scope.isCurrentSupplierNameRequired=true;
	}
	var salesPerson = {'code': currentQuote.salesPerson, 'key': currentQuote.salesPersonId, 'value': currentQuote.salesPerson}
	if (currentQuote.currentSupplierId>0) {
	var currentSupplierName = {'code': currentQuote.currentSupplierName, 'key': currentQuote.currentSupplierId, 'value': currentQuote.currentSupplierName}	
	}else{
	// var currentSupplierName = {'code': null, 'key': null, 'value': null}	
	var currentSupplierName ="";	
	}
	$scope.isEditViewShow=true;
	currentQuote.currentSupplierName=currentSupplierName;
	currentQuote.salesPerson=salesPerson;
	$scope.customerQuote=currentQuote;
	$scope.customerQuote.productList=$scope.getProductsListArray(currentQuote.productList);
    $scope.customerQuote.fax=currentQuote.faxNo;
    $scope.initCloseDate();
	$scope.initEditQuote(quote);
	$scope.filepreview=currentQuote.custLogo;
	// $rootScope.hideSpinner();
};
//====================== Get Quote Product LIst =================
var quoteView;
$scope.getQuoteProductList = function(quote){
	quoteView={};
	quoteView=angular.copy(quote);
	$rootScope.showSpinner();
	SQQuoteServices.GetQuoteProductList(quote.quoteId);
	
};

$scope.getQuoteInformation = function(quote){
console.log("getQuoteInformation");
console.log(quote);
$scope.getQuoteProductList(quote);
};


$scope.handleGetQuoteProductListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
	  console.log(data);
	  if(data.quoteInfo){
		  if(data.quoteInfo.productList){
			  console.log(quoteView);
			  quoteView.productList= angular.copy(data.quoteInfo.productList);
			  $scope.viewDetailInformation(quoteView);
		  }
	  };
}
}
// $rootScope.hideSpinner();
}
};

var cleanupEventGetQuoteProductListDone = $scope.$on("GetQuoteProductListDone", function(event, message){
$scope.handleGetQuoteProductListDoneResponse(message);      
});

var cleanupEventGetQuoteProductListNotDone = $scope.$on("GetQuoteProductListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// ===============****************************=================================
$scope.getProductsListArray=function(productList){
	// console.log("getProductsListArray");
	// console.log(JSON.stringify(productList));
	var list=[];	
	if (productList.length>0) {
		angular.forEach(productList, function(product, key){
			// console.log("looop... "+key)
			if (product.isAlternative!=null) {
				if (product.isAlternative.toUpperCase()=="YES" && key>0) {
				// console.log("product.isAlternative "+product.isAlternative.toUpperCase())
				if (product.altForQuoteDetailId>0) {
					angular.forEach(list, function(listProd, key){
						if (listProd.quoteDetailId==product.altForQuoteDetailId) {
							var altProd=product;
							listProd.altProd=angular.copy(altProd);
							listProd.isLinkedExact=true
						}
					});
				}
			}else{
				list.push(product);
			}
			}else{
				list.push(product);
			}
			// console.log(list)
		});
	}
	return list;
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
// SQManageMenuServices.GetProductDetails(product.code);
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

$scope.resetUpdateQuote=function(){
	// $rootScope.moveToTop();
	$log.debug("cancelCreateQuote call");
	$scope.customerQuote={};
	$scope.addedProductList=[];
	$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
	$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
	$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
	isSupplierExist=false;
	isSalesPersonExist=false;
	$scope.customerQuote.competeQuote="No";
	// $scope.serviceList=[];
	// $scope.termConditionList=[];
	$scope.currentSupplierList=angular.copy($rootScope.supplierList);	
	$scope.termConditionArray=angular.copy($rootScope.termConditionList);
	// $scope.termConditionList1=angular.copy($rootScope.termConditionList);
	$scope.serviceArray=angular.copy($rootScope.serviceList);
	// $scope.serviceList1=angular.copy($rootScope.serviceList);
	$scope.offerArray=angular.copy($rootScope.offerList);
	// $scope.offerList1=angular.copy($rootScope.offerList);

	$scope.isEditViewShow=false;
	$scope.form.addCustomerQuote.submitted=false;
	$scope.form.addCustomerQuote.$setPristine();
	$scope.showEditQuoteView=false;
	$scope.showAddProductError=false;
	$rootScope.isQuoteActivated=false;
	$scope.initDate();
	$scope.isSaveAndPrintInitiated=false;
	$('#currentSupplierName').focus();
}
$scope.cancelCreateQuote=function(){
var previousWindowKeyDown = window.onkeydown;
  swal({
  title: 'Confirm Navigation',
  text: "Your unsaved data will be lost. \n Are you sure you want to leave this page ?",
  showCancelButton: true,
  closeOnConfirm: true,
  cancelButtonText:"Stay on Page",
  confirmButtonText:"Leave Page"
  }, function (isConfirm) {
  if (isConfirm) {
    $scope.resetUpdateQuote();
  } 
  });
	
}
// ===================== ADD PRODUCTS=====================
$scope.resetCurrentSupplier=function(){
console.log("resetCurrentSupplier");
console.log($scope.customerQuote.productList.length)
$scope.customerQuote.currentSupplierName=null;
$scope.isCurrentSupplierNameRequired=false;
angular.forEach($scope.customerQuote.productList, function(value, key){
			value.currentSupplierPrice=0;
			value.currentSupplierTotal=0;
			value.currentSupplierGP=0;
			value.savings=0;
			if (value.altProd) {	
			if(value.altProd.itemCode){
			value.altProd.currentSupplierPrice=0;
			value.altProd.currentSupplierTotal=0;
			value.altProd.currentSupplierGP=0;
			value.altProd.savings=0;
			}
			};
		});
$scope.calculateAllInformation();
$('#currentSupplierName').focus();
$("#competeQuote").focus();
}

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
$scope.competeQuoteChanged=function(){
console.log($scope.customerQuote.competeQuote)
if ($scope.customerQuote.competeQuote=='No'){

	if ($scope.customerQuote.productList) {
	if($scope.customerQuote.productList.length>0){
		$scope.showConfirmationWindow();
	}else{
	$scope.isCurrentSupplierNameRequired=false;
	$scope.customerQuote.currentSupplierName="";
	}	
	}else{
	$scope.isCurrentSupplierNameRequired=false;
	$scope.customerQuote.currentSupplierName="";
	}
	// $scope.calculateAllInformation();
}
if ($scope.customerQuote.competeQuote=='Yes'){
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
		// SQManageMenuServices.GetProductList(prodLike);
		// $('#targetItemCode').blur();	
		}
	}
}
};
$scope.showAddProductModal=function(status,product,index){
	console.log('showAddProductModal')
	// console.log($scope.form.addCustomerQuote)
	// console.log("Product")
	// console.log(product)
	// console.log($scope.customerQuote.productList)
	var prod=angular.copy(product);
	if ($scope.isEditViewShow) {	
	if ($scope.form.addCustomerQuote.$valid) {
		// console.log("edit valid")
			$scope.productButtonStatus=status;
			$scope.isAddProductModalShow=true;
			// console.log($scope.productButtonStatus)
			if ($scope.productButtonStatus=='add') {
			    // $scope.initProducts();
			    $scope.openMyModal();
			}else if($scope.productButtonStatus=='edit'){
				$scope.editProduct=angular.copy(product);
				$scope.editIndex=index;
				// console.log(prod)
				$rootScope.showSpinner();
				$scope.getEditProductAlternatives($scope.editProduct.itemCode);

				// $scope.openMyModal();
			}

	}else{
		$scope.form.addCustomerQuote.submitted=true;		
	}
	}
};

$scope.assignAlternatives=function(data){
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				if (data.objProductResponseBean.alternativeProductList) {
				if (data.objProductResponseBean.alternativeProductList.length>0) {
					$scope.editProduct.alternativeProductList=angular.copy(data.objProductResponseBean.alternativeProductList);
				}	
				}
				$scope.openMyModal();
			}
		};			
	}
	$rootScope.hideSpinner();
};
$scope.getEditProductAlternatives=function(productCode){
// $rootScope.showLoadSpinner();
$http({
method: "POST",
// url: "/getProductDetails?productCode="+productCode,
url: $rootScope.projectName+"/getProductDetailsWithAlternatives?productCode="+productCode,
}).success(function(data, status, header, config){
console.log(data)
if (data.code=="sessionTimeOut") {
	$rootScope.$broadcast('QuoteSessionTimeOut', data);     
// $scope.addProductFromModal("sessiontimeout");
}else{
$scope.assignAlternatives(data);
}
}).error(function(data, status, header, config){
$rootScope.$broadcast('GetProductDetailsNotDone', data);
});
}
// ===============CALCULATION===============================
$scope.getPriceInPercentage=function(price,cost){
	var val;
	val=((price-cost)/price)*100;
	return val.toFixed(2);
};


// $scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
// $scope.getSupplierInformation=function(){
// 	var subtotal=0;
// 	var gstTotal=0;
// 	// console.log($scope.customerQuote.pricesGstInclude);
// 	if ($scope.customerQuote.productList.length>0) {
// 		angular.forEach($scope.customerQuote.productList, function(value, key){
// 			// console.log(value);
// 			subtotal=subtotal+parseFloat(value.currentSupplierTotal);	
// 			if ($scope.customerQuote.pricesGstInclude) {	
// 				if (value.gstFlag.toUpperCase()=='YES') {
// 					gstTotal=gstTotal+((10/100)*value.currentSupplierTotal)
// 				}
// 			}
// 		});
// 		$scope.supplierInformation.subtotal=subtotal;
// 		$scope.supplierInformation.gstTotal=gstTotal;
// 		$scope.supplierInformation.total=$scope.supplierInformation.subtotal+$scope.supplierInformation.gstTotal;
// 	}else{
// 		$scope.supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
// 	}
// };
// $scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
// $scope.getTotalInformation=function(){
// 	var subtotal=0;
// 	var gstTotal=0;
// 	if ($scope.customerQuote.productList.length>0) {
// 		angular.forEach($scope.customerQuote.productList, function(value, key){
// 			subtotal=subtotal+parseFloat(value.total);
// 			if ($scope.customerQuote.pricesGstInclude) {
// 			if (value.gstFlag.toUpperCase()=='YES') {
// 			gstTotal=gstTotal+((10/100)*parseFloat(value.total))
// 			}
// 			}
// 		});
// 		$scope.totalInformation.subtotal=subtotal;
// 		$scope.totalInformation.gstTotal=gstTotal;
// 		$scope.totalInformation.total=$scope.totalInformation.subtotal+$scope.totalInformation.gstTotal;
// 	}else{
// 		$scope.totalInformation={'subtotal':0,'gstTotal':0,'total':0};
// 	}
// };

// $scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
// $scope.getGpInformation=function(){
// 	var gpRequiredSubtotal=0;
// 	var currentSupplierGPSubtotal=0;
// 	var countGpRequired=0;
// 	var countcurrentSupplierGP=0;
// 	if ($scope.customerQuote.productList.length>0) {
// 		angular.forEach($scope.customerQuote.productList, function(value, key){
// 			gpRequiredSubtotal=gpRequiredSubtotal+parseFloat(value.gpRequired);
// 			countGpRequired++;
// 		});
// 		angular.forEach($scope.customerQuote.productList, function(value, key){
// 			currentSupplierGPSubtotal=currentSupplierGPSubtotal+parseFloat(value.currentSupplierGP);
// 			countcurrentSupplierGP++;
// 		});
// 		$scope.gpInformation.avgGpRequired=gpRequiredSubtotal/countGpRequired;
// 		$scope.gpInformation.avgCurrentSupplierGp=currentSupplierGPSubtotal/countcurrentSupplierGP;
// 	}else{
// 		$scope.gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};	
// 	}
// };
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
	// console.log("calculateAllInformation")
	$scope.getSupplierInformation();
  	$scope.getGpInformation();
  	$scope.getTotalInformation();	
  	$scope.calculateAlternativeProductsInformation();
};
//=============Calculation==========================
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
	// console.log("isAlternateAdded" + $scope.isAlternateAdded)
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
	// console.log($rootScope.addedProductCount);
}
//============================================================

$rootScope.addProductToEditQuote=function(dataFromModal){
	console.log("addProductToEditQuote<<<<<<<<...>>>>>")
	$scope.addProduct=dataFromModal.addProduct;
	$scope.productButtonStatus=dataFromModal.productButtonStatus;
	$scope.isNewProduct=dataFromModal.isNewProduct;
	console.log($scope.addProduct)
	var product;
	product=angular.copy($scope.addProduct);
	// console.log(product);
	if (product.currentSupplierPrice>0 && product.quotePrice>0) {//product.currentSupplierPrice>product.quotePrice
	if (product.currentSupplierPrice==product.quotePrice) {
	product.savings=0;	
	}else{
	product.savings=$scope.getPriceInPercentage(product.currentSupplierPrice,product.quotePrice);	
	}
	};
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
			'gstFlag':product.gstFlag,
			'isLinkedExact':product.isLinkedExact,
			'lineComment':product.lineComment,
			'isAlternative':'no'
			};	
			if (product.isLinkedExact) {	
			if(product.altProd!=null){
			var altUnitDiviser = product.altProd.unitDiviser
			// newProduct.isLinkedExact=product.isLinkedExact
			if (product.altProd.currentSupplierPrice>0 && product.altProd.quotePrice>0) {//product.altProd.currentSupplierPrice>product.altProd.quotePrice
			if (product.altProd.currentSupplierPrice==product.altProd.quotePrice) {
			product.altProd.savings=0;		
			}else{
			// var price = product.altProd.quotePrice / product.altProd.unitDiviser;	
			product.altProd.savings=$scope.getPriceInPercentage(product.altProd.currentSupplierPrice,product.altProd.quotePrice);	
			}
			};
			if (product.altProd.currentSupplierPrice>0) {
			// var altAvgCost = product.altProd.avgcost / product.altProd.unitDiviser;	
			product.altProd.currentSupplierGP=$scope.getPriceInPercentage(product.altProd.currentSupplierPrice,product.altProd.avgcost);	
			}else{
			product.altProd.currentSupplierGP=0;	
			product.altProd.currentSupplierPrice=0;		
			}	
			product.altProd.total=product.altProd.itemQty*product.altProd.quotePrice;
			product.altProd.currentSupplierTotal=product.altProd.itemQty*product.altProd.currentSupplierPrice;
			product.altProd.gpRequired=$scope.getPriceInPercentage(product.altProd.quotePrice,product.altProd.avgcost);
			}
			newProduct.altProd=product.altProd;
			}
	 		product=angular.copy(newProduct);
	 		$log.debug(JSON.stringify(product))
	}else{
		product.isNewProduct=$scope.isNewProduct;
	}

	if ($scope.productButtonStatus=='add') {
		if ( $scope.customerQuote.productList.length>0) {
 			$scope.customerQuote.productList.push(product);	
  			$scope.calculateAllInformation();
  			$scope.checkAlternativeAdded();
	 	}else{ 		
	 	$scope.customerQuote.productList.push(product);	
	 	$scope.calculateAllInformation();
	 	$scope.checkAlternativeAdded();
	    // $scope.closeAddProductModal();
	 	}
	};
 	if ($scope.productButtonStatus=='edit') {
 		$scope.customerQuote.productList[$scope.editIndex]=product;
 		$scope.calculateAllInformation();
 		$scope.checkAlternativeAdded();
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
	var productList=angular.copy($scope.customerQuote.productList);	
	productList.splice(index,1);
	$scope.customerQuote.productList = productList;
	$scope.calculateAllInformation();
	$scope.checkAlternativeAdded();
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
	$scope.customerQuote=angular.copy(quote);
	$scope.comment='';
};

$scope.addComment=function(){
// console.log($scope.comment);
// console.log($scope.customerQuote);
if ($scope.form.commentForm.$valid) {
	$rootScope.showSpinner();
	SQQuoteServices.AddComment($scope.customerQuote.quoteId,$scope.comment);
}else{
	$scope.form.commentForm.submitted=true;
}
};

//====================== Get Quote Comment List =================
var quoteViewComment;
$scope.getQuoteCommentList = function(quote){
	quoteViewComment={};
	quoteViewComment=angular.copy(quote);
	$rootScope.showSpinner();
	SQQuoteServices.GetQuoteCommentList(quote.quoteId);
	
};

$scope.getQuoteComments = function(quote){
// console.log("getQuoteInformation");
// console.log(quote);
$scope.getQuoteCommentList(quote);
};


$scope.handleGetQuoteCommentListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
	  console.log(data);
	  if(data.quoteInfo){
		  if(data.quoteInfo.commentList){
			quoteViewComment.commentList=angular.copy(data.quoteInfo.commentList);
			$scope.showCommentModal(quoteViewComment);
		  }
	  };
}
}
$rootScope.hideSpinner();
}
};

var cleanupEventGetQuoteCommentListDone = $scope.$on("GetQuoteCommentListDone", function(event, message){
$scope.handleGetQuoteCommentListDoneResponse(message);      
});

var cleanupEventGetQuoteCommentListNotDone = $scope.$on("GetQuoteCommentListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*=============GET PRODUCT GROUP LIST==================*/
/*============= Comment On Quote==================*/
$scope.pushComment=function(array,quote){
// console.log(quote);
objIndex = array.findIndex((obj => obj.quoteId == quote.quoteId));
array[objIndex].commentList = $scope.customerQuote.commentList;
} 
$scope.closeCommentModal=function(quote){
	$('#commentModal').modal('hide');
	$scope.form.commentForm.submitted=false;
   	$scope.form.commentForm.$setPristine();
   	// $scope.init();	
   	// $scope.initViewEditQuote();
};
$scope.handleAddCommentDoneResponse=function(data){
if(data){
if (data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
   var comment=data.result;
   $scope.customerQuote.commentList.push(comment);
   $scope.pushComment($scope.quoteListView,$scope.customerQuote); 
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
// $scope.saveAsPDF=function(quote){
// console.log(quote);
//  var url =$rootScope.projectName+"/custComparison?quoteId="+quote.quoteId;
//  window.open(url,'location=1,status=1,scrollbars=1,width=1050,fullscreen=yes,height=1400');
// };
$scope.exportToPronto=function(quote){
	console.log(quote);
	 var url =$rootScope.projectName+"/exportToPronto?quoteId="+quote.quoteId;
	 window.open(url,'location=1,status=1,scrollbars=1,width=1050,fullscreen=yes,height=1400');
	};

//==============================================Update Quote=======================================
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
			alternativeArray.push(obj);
		}
	}
});
return alternativeArray;
};
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
}else if($scope.customerQuote.currentSupplierName==''||$scope.customerQuote.currentSupplierName==null){
	console.log("$scope.customerQuote.currentSupplierName "+$scope.customerQuote.currentSupplierName);
	supplierName=$scope.customerQuote.currentSupplierName;
	supplierId=-1;
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

'modifiedDate':moment($scope.customerQuote.modefiedDate).format('YYYY-MM-DD HH:mm:ss'),
'closeDate':moment($scope.customerQuote.closeDate).format('YYYY-MM-DD HH:mm:ss'),
'competeQuote':$scope.customerQuote.competeQuote,
'salesPerson':salesPerson,
'salesPersonId':salesPersonId,
'pricesGstInclude':$scope.customerQuote.pricesGstInclude,
'notes':$scope.customerQuote.notes,
'productList':$scope.customerQuote.productList,
// 'productList':$scope.jsonOfProductList($scope.customerQuote),
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

$scope.updateQuote=function(){
console.log("updateQuote call");
console.log($scope.form.addCustomerQuote);
console.log($scope.customerQuote);
$scope.validateDate($scope.customerQuote.modefiedDate,$scope.customerQuote.closeDate);
if ($scope.form.addCustomerQuote.$valid) {
	if ($scope.customerQuote.salesPerson.value == null || $scope.dateInvalid) {
		$rootScope.moveToTop();
		if ($scope.customerQuote.salesPerson.value == null) {
		$scope.form.addCustomerQuote.salesPerson.$invalid = true;
		$scope.form.addCustomerQuote.submitted=true;
		$scope.form.addCustomerQuote.salesPerson.$error.required=true;
		} 
	} else{
		if ($scope.customerQuote.productList.length>0) {
		isSalesPersonExist=false;
		isSupplierExist=false;
		angular.forEach($scope.currentSupplierList, function(currentSupplierName, key){
			if ($scope.customerQuote.currentSupplierName!=undefined&&$scope.customerQuote.currentSupplierName!=''&&$scope.customerQuote.currentSupplierName!=null) {	
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
		if (isSupplierExist) {
			if (isSupplierExist) {
				$scope.form.addCustomerQuote.currentSupplierName.$invalid=true;
				$scope.form.addCustomerQuote.submitted=true;
				$('#currentSupplierName').focus();
			}else{
				$scope.form.addCustomerQuote.currentSupplierName.$invalid=false;
			}
		}else{
			console.log(JSON.stringify($scope.jsonToCreateQuote()));
			$rootScope.showSpinner();
			SQQuoteServices.UpdateQuote(JSON.stringify($scope.jsonToCreateQuote()));
		}
	}else{
		$log.debug("please add products");
		$scope.showAddProductError=true;
		$('#addProductLink').focus();
	}
	};

 	
}else{
	$log.debug("invalid form");
	$rootScope.moveToTop();
	$scope.form.addCustomerQuote.submitted=true;
}
};



//UPDATE QUOTE RESPONSE >>>>>
function checkQuoteResponse(quoteResponse){
console.log("checkQuoteResponse" +quoteResponse);
if (quoteResponse) {
// if (quoteResponse.newCustomerCreated) {
// // var obj={"code":$scope.customerQuote.customerCode,"key":quoteResponse.genratedCustomerId,"value":$scope.customerQuote.customerCode+" ("+$scope.customerQuote.customerName+")"};
// // ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.customerList,obj);
// } 
if (quoteResponse.newSupplierCreated) {
var obj={"code":supplierName,"key":quoteResponse.genratedSupplierId,"value":supplierName};
ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.supplierList,obj);
} 
if (quoteResponse.newProductCreated) {
	$rootScope.initAuotoComplete(true);
};
};
};

var updateQuoteResponse={};
$scope.handleUpdateQuoteDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	// console.log(data)
  	 // $rootScope.alertSuccess("Successfully updated quote");
	updateQuoteResponse=data;
	if($scope.isSaveAndPrintInitiated){
		$scope.saveAsPDF($scope.quoteId);
	};    
	
  	 swal({
	  title: "Success",
	  text: "Successfully updated proposal...!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	   // $scope.cancelCreateQuote();
	 checkQuoteResponse(updateQuoteResponse);	
  	 $scope.resetUpdateQuote();
  	 $scope.initViewEditQuote();
  	 // $scope.init();	
	});
  }else{
  	$rootScope.alertError(data.message);
  }
 $rootScope.hideSpinner();
}}
};

var cleanupEventCreateQuoteDone = $scope.$on("QuoteSessionTimeOut", function(event, message){     
$scope.resetUpdateQuote();
$rootScope.$broadcast('SessionTimeOut', message); 		
$rootScope.alertSessionTimeOutOnQuote();
});

var cleanupEventUpdateQuoteDone = $scope.$on("UpdateQuoteDone", function(event, message){
$scope.handleUpdateQuoteDoneResponse(message);      
});

var cleanupEventUpdateQuoteNotDone = $scope.$on("UpdateQuoteNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

//=================================================================================================
$scope.dynamicPopover = {
templateUrl: 'myPopoverTemplate.html',
title: 'Customer Logo'
};

$scope.shouldShow = function (user) {
// put your authorization logic here
return user.code !== 1 && user.value !== 'admin';
}


//=================== Update & Print Generated Proposal ====================
$scope.isSaveAndPrintInitiated=false;
$scope.saveAsPDF=function(quoteId){
console.log("saveAsPDF >>");
var url =$rootScope.projectName+"/custComparison?quoteId="+quoteId;
console.log(url)
$window.open(url, '_blank');
// $window.open(url,'location=1,status=1,scrollbars=1,width=1050,fullscreen=yes,height=1400');
};

$scope.updateAndPrintProposal=function(){
	$scope.quoteId=$scope.customerQuote.quoteId;
	$scope.isSaveAndPrintInitiated = true;
	$scope.updateQuote();
};
//=================== Delete Proposal ====================
	$scope.deleteQuote=function(quote){
		$rootScope.showSpinner();
		SQQuoteServices.DeleteQuote(quote.quoteId);
	};
	$scope.confirmedDeleteQuote=function(quote){
		var previousWindowKeyDown = window.onkeydown;
			swal({
			title: 'Are you sure ?',
			text: "You will not be able to recover this proposal \n"+quote.quoteId,
			showCancelButton: true,
			closeOnConfirm: true,
			cancelButtonText:"Cancel",
			confirmButtonText:"Confirm"
			}, function (isConfirm) {
			if (isConfirm) {
				$scope.deleteQuote(quote);
			}
			});
	};
	$scope.deleteQuoteClicked=function(quote){
		$scope.confirmedDeleteQuote(quote);
	};

	$scope.handleDeleteQuoteDoneResponse=function(data){
	if(data){
	if (data.code){
	  if(data.code.toUpperCase()=='SUCCESS'){
	   console.log(data);
	   swal({
		title: "Success",
		text: "Successfully Deleted Proposal...!",
		type: "success",
		// animation: "slide-from-top",
	  },
	  function(){
		//  $scope.resetUpdateQuote();
		$scope.initViewEditQuote();
	  });
	  }else{
	   $rootScope.alertError(data.message);
	   $rootScope.hideSpinner();
	  }
	}
	}
	};
	
	var cleanupEventDeleteQuoteDone = $scope.$on("DeleteQuoteDone", function(event, message){
	// console.log("AddCommentDone");
	$scope.handleDeleteQuoteDoneResponse(message);      
	});
	
	var cleanupEventDeleteQuoteNotDone = $scope.$on("DeleteQuoteNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
	});
//=============== Change Product Order ========================
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};


var currentProductList=[];
var newProductList=[];
$scope.moveProduct = function(product){
	newProductList.push(product);
};

$scope.changeProductOrder = function(newOrderNo,oldOrderNo,quoteDetailId){
var newIndex,oldIndex;
oldIndex = oldOrderNo-1;newIndex= newOrderNo-1; 
if (newIndex<$scope.customerQuote.productList.length && newIndex >=0) {
array_move($scope.customerQuote.productList,oldIndex,newIndex); 
for (var i = 0; i < $scope.customerQuote.productList.length; i++) {
$scope.customerQuote.productList[i].orderNo = i+1;
$scope.customerQuote.productList[i].newOrderNo = $scope.customerQuote.productList[i].orderNo;
};
}else{
console.log("invalid index");
console.log(newOrderNo,oldOrderNo);
$scope.customerQuote.productList[oldIndex].newOrderNo=oldOrderNo;
};
}
$scope.changeProductOrderConfirmed = function(newOrderNo,oldOrderNo,quoteDetailId){
var previousWindowKeyDown = window.onkeydown;
swal({
title: 'Are you sure ?',
text: "Are you sure you want to change line "+oldOrderNo+" to line "+newOrderNo,
showCancelButton: true,
closeOnConfirm: true,
cancelButtonText:"No",
confirmButtonText:"Yes"
}, function (isConfirm) {
if (isConfirm) {
	$scope.changeProductOrder(newOrderNo,oldOrderNo,quoteDetailId);
}else{
	var oldIndex = oldOrderNo-1;
	$scope.customerQuote.productList[oldIndex].newOrderNo=oldOrderNo;
}
});
};

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
	cleanupEventUpdateQuoteDone();
	cleanupEventUpdateQuoteNotDone();
	cleanupEventGetQuoteViewDone();
	cleanupEventGetQuoteViewNotDone();
	cleanupEventGetProductGroupListDone();
	cleanupEventGetProductGroupListNotDone();
	cleanupEventDeleteQuoteDone();
	cleanupEventDeleteQuoteNotDone();
	cleanupEventGetQuoteProductListDone();
	cleanupEventGetQuoteProductListNotDone();
	cleanupEventGetQuoteCommentListDone();
	cleanupEventGetQuoteCommentListNotDone();
	cleanupEventGetTermsAndServiceListDone();
	cleanupEventGetTermsAndServiceListNotDone();
	$rootScope.isQuoteActivated=false;
});

});

// jQuery.extend( jQuery.fn.dataTableExt.oSort, {
//   "date-close-pre": function ( date ) {
//     // console.log(moment(date, 'dddd, MMMM Do, YYYY').format('DD-MM-YYYY'));
//     return moment(date, 'dddd, MMMM Do, YYYY');
//   },
//  } );
// jQuery.extend( jQuery.fn.dataTableExt.oSort, {
//     "date-au-pre": function ( a ) {
//         if (a == null || a == "") {
//             return 0;
//         }
//         var ukDatea = a.split('/');
//         return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
//     },
 
//     "date-au-asc": function ( a, b ) {
//         return ((a < b) ? -1 : ((a > b) ? 1 : 0));
//     },
 
//     "date-au-desc": function ( a, b ) {
//         return ((a < b) ? 1 : ((a > b) ? -1 : 0));
//     }
// } );

// jQuery.extend( jQuery.fn.dataTableExt.oSort, {
//   "date-au-pre": function ( date ) {
//     console.log(moment(date, 'dddd, MMMM Do, YYYY').format('DD-MM-YYYY'));
//     return moment(date, 'dddd, MMMM Do, YYYY');
//   },

//   "date-au-asc": function ( a, b ) {
//     return (a.isBefore(b) ? -1 : (a.isAfter(b) ? 1 : 0));
//   },

//   "date-au-desc": function ( a, b ) {
//     return (a.isBefore(b) ? 1 : (a.isAfter(b) ? -1 : 0));
//   }
// } );

// jQuery.extend( jQuery.fn.dataTableExt.oSort, {
// "date-uk-pre": function ( a ) {
//     var ukDatea = a.split('/');
//     return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
// },

// "date-uk-asc": function ( a, b ) {
//     return ((a < b) ? -1 : ((a > b) ? 1 : 0));
// },

// "date-uk-desc": function ( a, b ) {
//     return ((a < b) ? 1 : ((a > b) ? -1 : 0));
// }
// } );