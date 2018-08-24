	angular.module('sq.SmartQuoteDesktop')
	.controller('SQAddProductModalController',function($uibModalInstance,dataToModal,$scope,$rootScope,hotkeys,SQManageMenuServices,SQQuoteServices,$uibModal,$http,hotkeys){
	console.log('initialise SQAddProductModalController');
	// $('#searchProduct').focus();

	$scope.form={};
	$scope.addProduct={};
	$scope.addProduct.gstFlag='NO'
	$scope.customerQuote={};
	$scope.isNewProduct=false;

	console.log(dataToModal);

	$scope.customerQuote=dataToModal.customerQuote;
	$scope.productButtonStatus=dataToModal.productButtonStatus;
	// $scope.productList=dataToModal.productList;
	$scope.productGroupList=dataToModal.productGroupList;
	// $scope.productList=$rootScope.globalProductList;
	// $scope.productGroupList=$rootScope.globalProductGroupList;
	$scope.isAddProductModalShow=dataToModal.isAddProductModalShow;
	// $scope.addedProductCount=dataToModal.addedProductCount;
	// $('#searchProduct').focus();	  

	var quoteStatus=dataToModal.quoteStatus;
	$scope.modelOptions = {
	debounce: {
	default: 500,
	blur: 250
	},
	getterSetter: true
	};

	$scope.search={}
	$scope.search.selectedProduct="";
	$scope.isCollapsed=false;
	$scope.select={};
	$scope.select.type="search";

	//initialising Search======================
	// $scope.selectedProduct=null;
	//  products = new Bloodhound({
	//     datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.value); },
	//     queryTokenizer: Bloodhound.tokenizers.whitespace,
	//     local: $scope.productList
	//   });
	//        products.initialize();
	//        $scope.productsDataset = {
	//          displayKey: 'value',
	//          limit: 200,
	//          source: products.ttAdapter(),
	//        };
	//        $scope.exampleOptions = {
	//          displayKey: 'title',
	//          highlight: true
	//        };
	//initialising Search=========================

	$scope.ok = function () {
	console.log("ok clicked")
	$uibModalInstance.close($scope.addProduct);
	};

	// $scope.cancel = function () {
	// $uibModalInstance.dismiss('cancel');
	// console.log("cancel clicked")
	// };

	$scope.quotePriceFocused=function(){
	$('#quotePrice').change();
	}

	$scope.standardProductQuantityChanged=function(qty){
	// $('#quotePrice').change();
	if ($scope.addProduct.altProd!=undefined) {
	console.log("standardProductQuantityChanged",qty);
	$scope.addProduct.altProd.itemQty=qty;
	};
	}


	$scope.getProductObject=function(product){
	var prodObj=angular.copy(product);
	if (prodObj.isLinkedExact&& prodObj.altProd){
	if (prodObj.altProd.itemCode){
	if (product.currentSupplierPrice!=''||product.currentSupplierPrice>0) {
	prodObj.altProd.currentSupplierPrice=product.currentSupplierPrice;
	prodObj.altProd.currentSupplierGP=$scope.getPriceInPercentage(prodObj.altProd.currentSupplierPrice,prodObj.altProd.avgcost);
	prodObj.altProd.currentSupplierTotal=prodObj.altProd.currentSupplierPrice*prodObj.altProd.itemQty;
	}else{
	prodObj.altProd.currentSupplierPrice=0;
	prodObj.altProd.currentSupplierGP=0;	
	prodObj.altProd.currentSupplierTotal=0;		
	}
	prodObj.altProd.total=prodObj.altProd.quotePrice*prodObj.altProd.itemQty;
	prodObj.altProd.gpRequired=$scope.getPriceInPercentage(prodObj.altProd.quotePrice,prodObj.altProd.avgcost);
	// prodObj.altProd.altForQuoteDetailId=0;
	// prodObj.altProd.altForQuoteDetailId=0;
	if (prodObj.altProd.currentSupplierPrice>0) {//prodObj.altProd.currentSupplierPrice>prodObj.altProd.quotePrice && 
	var price= 	prodObj.altProd.quotePrice/prodObj.altProd.unitDiviser;
	prodObj.altProd.savings=$scope.getPriceInPercentage(prodObj.altProd.currentSupplierPrice,price);
	}else{
	prodObj.altProd.savings=0;
	}
	}
	}
	return prodObj;
	};

	$scope.getDataFromModal=function(addNextProduct){
	var dataFromModal={
	'addProduct':$scope.getProductObject($scope.addProduct),
	'addNextProduct':addNextProduct,
	'productButtonStatus':$scope.productButtonStatus,
	'isNewProduct':$scope.isNewProduct,
	'isAddProductModalShow':false,
	}
	return dataFromModal;
	};
	$scope.addProductFromModal=function(addNextProduct){
	console.log("addProductFromModal")
	console.log(addNextProduct)
	console.log($scope.form.addProductIntoQuote)	
	console.log($scope.addProduct);	
	if ($scope.form.addProductIntoQuote.$valid) {
	// if (parseFloat($scope.addProduct.quotePrice)>=parseFloat($scope.addProduct.avgcost)) {
	var dataFromModal=$scope.getDataFromModal(addNextProduct);
	if(addNextProduct.toLowerCase()=="addnextproduct") {
	if (quoteStatus=='create') {
	$rootScope.addProductToQuote(dataFromModal);
	}else if(quoteStatus=='edit'){
	$rootScope.addProductToEditQuote(dataFromModal);
	}
	$scope.addProduct={};
	$scope.productInfo=undefined;
	$scope.altProductInfo=undefined;
	$scope.form.addProductIntoQuote.submitted=false;
	$scope.form.addProductIntoQuote.$setPristine();
	$scope.priceArray=[];
	$scope.search.selectedProduct="";
	$('#searchProduct').focus();	
	}else if(addNextProduct.toLowerCase()=="saveclose"){
	$uibModalInstance.close(dataFromModal);
	}
	// }else{
	// console.log("Invalid product data");		
	// $('#quotePrice').focus();
	// $scope.isSellingPriceInvalid=true;	
	// // $scope.form.addProductIntoQuote.price0exGST.$invalid=true;
	// }
	}else{
	$scope.form.addProductIntoQuote.submitted=true;
	console.log();
	if(addNextProduct.toLowerCase()=="sessiontimeout"){
	dataFromModal={
	'addNextProduct':"sessiontimeout",
	'isAddProductModalShow':false,
	}
	console.log("sessionTimeOut...")
	$uibModalInstance.close(dataFromModal);
	}else{
	if ($scope.customerQuote.competeQuote.toUpperCase()=='YES') {
	console.log("COMPETE");
	if ($scope.search.selectedProduct=="" || $scope.search.selectedProduct==null) {
	$('#searchProduct').focus();
	}else if ($scope.form.addProductIntoQuote.currentSupplierPrice.$invalid) {
	$('#currentSupplierPrice').focus();
	}else if ($scope.form.addProductIntoQuote.quotePrice.$invalid) {
	$('#quotePrice').focus();
	}else if($scope.form.addProductIntoQuote.itemQty.$invalid){
	$('#itemQty').focus();
	}
	}else{
	if ($scope.search.selectedProduct=="" || $scope.search.selectedProduct==null) {
	$('#searchProduct').focus();
	}else if ($scope.form.addProductIntoQuote.quotePrice.$invalid) {
	$('#quotePrice').focus();
	}else if($scope.form.addProductIntoQuote.itemQty.$invalid){
	$('#itemQty').focus();
	}
	}
	}
	}	

	};

	$rootScope.addNextProduct=function(){
	var addNextProduct="addnextproduct";	
	// console.log("addNextProduct")
	$scope.addProductFromModal(addNextProduct);
	};

	$rootScope.saveAndClose=function(){
	var addNextProduct="saveclose";	
	// console.log("saveAndClose")
	$scope.addProductFromModal(addNextProduct);
	}

	$rootScope.closeModal=function(){
	$uibModalInstance.dismiss('cancel');
	// console.log("cancel clicked")
	}

	// ==============CALCULATIONS=================
	$scope.validateSellingPrice=function(){
	if ($scope.addProduct.avgcost) {
	var price =parseFloat($scope.addProduct.quotePrice);
	var cost =$scope.addProduct.avgcost;
	if (parseFloat(price)>=parseFloat(cost)) {
	// console.log("isSellingPriceValid")	
	$scope.isSellingPriceInvalid=false;
	}else{
	// console.log("isSellingPriceInvalid")
	$scope.isSellingPriceInvalid=true;
	}
	}		
	};

	$scope.getPriceInPercentage=function(price,cost){
	var val;
	val=((price-cost)/price)*100;
	return val.toFixed(2);
	};

	$scope.sellingPriceChanged=function(price,cost){
	console.log("sellingPriceChanged");
	var price1=price;
	var cost1=cost;
	if (price1==0){
	$scope.addProduct.gpRequired=0;
	}else{
	$scope.addProduct.gpRequired=$scope.getPriceInPercentage(price1,cost1);
	}
	};

	$scope.getSellingPrice=function(cost,gprequired){
	var val;
	var val1=cost*100;
	var val2=100-gprequired;
	val=val1/val2;
	return val.toFixed(2);
	};

	$scope.GpRequiredChanged=function(cost,gprequired){
	// console.log("GpRequiredChanged");
	// console.log(cost,gprequired);
	if (gprequired) {
	var sellingPrice=$scope.getSellingPrice(cost,gprequired);
	if ($scope.form.addProductIntoQuote.quotePrice.$valid) {
	$scope.addProduct.quotePrice=sellingPrice;	
	}else{
	$scope.addProduct.quotePrice=0;
	}
	}else{
	$scope.addProduct.quotePrice=0;
	}
	};

	$scope.currentSupplierPriceChanged=function(price,cost){
	// console.log("currentSupplierPriceChanged");
	if ($scope.form.addProductIntoQuote.currentSupplierPrice&&$scope.form.addProductIntoQuote.avgcost) {
	if ($scope.form.addProductIntoQuote.currentSupplierPrice.$valid&&$scope.form.addProductIntoQuote.avgcost.$valid) {
	$scope.addProduct.currentSupplierGP=$scope.getPriceInPercentage(price,cost);
	}else{
	$scope.addProduct.currentSupplierGP=0;
	}	
	};

	};
	$scope.productSavings=function(){
	var savings ;
	if ($scope.addProduct.currentSupplierPrice>0&&$scope.addProduct.quotePrice>0) {
	if ($scope.addProduct.currentSupplierPrice==$scope.addProduct.quotePrice) {
	savings=0;
	}else{
	savings=$scope.getPriceInPercentage($scope.addProduct.currentSupplierPrice,$scope.addProduct.quotePrice);
	};
	}else{
	savings=0;
	};
	return savings;
	};
	$scope.productSavingsNegative=function(){
	var savings ;
	if ($scope.addProduct.currentSupplierPrice>0&&$scope.addProduct.quotePrice>0) {
	savings=$scope.getPriceInPercentage($scope.addProduct.currentSupplierPrice,$scope.addProduct.quotePrice);
	return Math.abs(savings);
	}
	};	
	$scope.productSavingsNegativeForProgress=function(){
	var savings=0 ;
	if ($scope.addProduct.currentSupplierPrice>0&&$scope.addProduct.quotePrice>0) {
		if ($scope.addProduct.currentSupplierPrice==$scope.addProduct.quotePrice) {
		savings=0;	
		}else{
		savings=$scope.getPriceInPercentage($scope.addProduct.currentSupplierPrice,$scope.addProduct.quotePrice);
		savings=parseFloat(savings);	
		};
	}
		savings=Math.abs(savings);
		savings=5+savings
		// console.log("productSavingsNegativeForProgress ::" + savings)
		return Math.abs(savings);
	};

	
	// ==============CALCULATIONS=================
	/*===================GET PRODUCT DETAILS=================*/
	$scope.checkIfProductExist=function(){
	$scope.isProductExist=false;
	angular.forEach( $scope.addedProductList, function(value, key){
	if (value.itemCode==$scope.addProduct.itemCode) {
	// console.log("Duplicates")
	$scope.isProductExist=true;
	}
	});
	};

	$scope.disableCurrentSupplierGP=false;

	// $scope.GetProductDetails = function (productCode){

	//    };

	$scope.getProductDetails=function(productCode){
	$rootScope.showLoadSpinner();
	SQQuoteServices.GetProductDetailsWithAlternatives(productCode);
	// SQManageMenuServices.GetProductDetails(productCode);
	// $http({
	// method: "POST",
	// // url: "/getProductDetails?productCode="+productCode,
	// url: "/getProductDetailsWithAlternatives?productCode="+productCode,
	// }).success(function(data, status, header, config){
	// console.log(data)
	// if (data.code=="sessionTimeOut") {
	// // $rootScope.$broadcast('SessionTimeOut', data);
	// $scope.addProductFromModal("sessiontimeout");
	// }else{
	// $rootScope.$broadcast('GetProductDetailsDone', data); 
	// }
	// }).error(function(data, status, header, config){
	// //console.log(data);
	// $rootScope.$broadcast('GetProductDetailsNotDone', data);
	// });

	};


	$scope.handleGetProductDetailsDoneResponse=function(data){
	if(data){
	if (data.code) {
	if(data.code.toUpperCase()=='SUCCESS'){
	console.log("getProductDetails");
	// console.log(JSON.stringify(data.objProductResponseBean));	
	// console.log(JSON.stringify($scope.assighProductDetails(data.objProductResponseBean)))
	// $scope.addProduct=$scope.assighProductDetails(data.objProductResponseBean);
	// $scope.productInfo=$scope.assighProductDetails(data.objProductResponseBean);
	$scope.addProduct=angular.copy(data.objProductResponseBean);
	$scope.addProduct.isAlternative='no';
	$scope.productInfo=angular.copy($scope.addProduct);

	if (data.objProductResponseBean.alternativeProductList) {
	if (data.objProductResponseBean.alternativeProductList.length>0) {
	$scope.alternativeProductList=angular.copy(data.objProductResponseBean.alternativeProductList);
	$scope.select.type='select';
	}else{
		$scope.select.type="search";
	}	
	}else{
		$scope.select.type="search";
	}

	$scope.addProduct.quotePrice='';
	$scope.addProduct.itemQty=1;
	$scope.addProduct.currentSupplierPrice='';
	$scope.addProduct.currentSupplierGP='';
	$scope.addProduct.gpRequired='';
	$scope.search.selectedProduct="";

	if (data.objProductResponseBean.promoPrice>0) {
		$scope.addProduct.quotePrice=data.objProductResponseBean.promoPrice;
		$scope.sellingPriceChanged($scope.addProduct.quotePrice,$scope.addProduct.avgcost);
	};

	if ($scope.addProduct.gstFlag!=null) {
	if ($scope.addProduct.gstFlag.toUpperCase()=='NO') {
	$scope.disableCurrentSupplierGP=true;	
	}
	};
	$scope.createArrayOfQuantityAndPrice($scope.addProduct);
	$scope.isProductSelected=true;

	// $('#quotePrice').change();
	}else{
	$rootScope.alertError(data.message);
	}
	}
	if ($scope.customerQuote.competeQuote.toUpperCase()=='YES') {
	$('#currentSupplierPrice').focus();		
	}else{
	$('#quotePrice').focus();		
	}
	}
	// $rootScope.hideSpinner();
	$rootScope.hideLoadSpinner();
	};

	var cleanupEventGetProductDetailsDone = $scope.$on("GetProductDetailsWithAlternativesDone", function(event, message){
	if (message.code=="sessionTimeOut") {
	$scope.addProductFromModal("sessiontimeout");
	}else{
	$scope.handleGetProductDetailsDoneResponse(message);      
	}
	});

	var cleanupEventGetProductDetailsNotDone = $scope.$on("GetProductDetailsWithAlternativesNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
	});

	$scope.createArrayOfQuantityAndPrice=function(product){
	// console.log("createArrayOfQuantityAndPrice")
	// $log.debug(product);
	var qty=[]
	var price=[]
	$scope.quantityArray=[];
	$scope.priceArray=[];
	if (product.price0exGST || product.price1exGST || product.price2exGST || product.price3exGST || product.price4exGST) {	
	price.push(product.price0exGST.toString());
	price.push(product.price1exGST.toString());
	price.push(product.price2exGST.toString());
	price.push(product.price3exGST.toString());
	price.push(product.price4exGST.toString());
	// console.log(price);
	angular.forEach(price, function(value, key){
	if (value==price[key+1]) {
	}else{
	$scope.priceArray.push(value);
	}
	});
	}
	if (product.qtyBreak0 || product.qtyBreak1 || product.qtyBreak2 || product.qtyBreak3 || product.qtyBreak4) {	
	qty.push(product.qtyBreak0.toString());
	qty.push(product.qtyBreak1.toString());
	qty.push(product.qtyBreak2.toString());
	qty.push(product.qtyBreak3.toString());
	qty.push(product.qtyBreak4.toString());
	// console.log(price);
	angular.forEach(qty, function(value, key){
	if (value==qty[key+1]) {
	}else{
	$scope.quantityArray.push(value);
	}
	});
	}

	}

	$scope.productCodeNotFound=function(noProductFound){
	// console.log("productCodeNotFound")
	// console.log(noProductFound)
	if (noProductFound!=undefined) {
	if ($scope.productButtonStatus=='add') {
	$scope.isNewProduct=noProductFound;
	}
	}
	};


	$scope.isLoading=false;
	$scope.productCodeChanged=function(prod){
	console.log("productCodeChanged");
	console.log(prod);
	$scope.addProduct.itemCode=prod;
	if ($scope.isProductSelected) {
	var code=$scope.addProduct.itemCode;	
	$scope.addProduct={};
	$scope.productInfo=undefined;
		if ($scope.search.selectedAltProduct) {
		$scope.search.selectedAltProduct='';
		$scope.altProductInfo=undefined;
		}
		$scope.addProduct.itemCode=code;
		$scope.priceArray=[];
		$scope.isProductSelected=false;
		// $scope.isProductInvalid=true;
		if (prod) {
		if (prod.code) {
		// console.log(prod.code);
		// $scope.addProduct.itemCode=prod.code;
		// var proCode=prod.code.replace(/\s+/g,'');;
		var proCode=prod.code;
		console.log(proCode);
		$scope.getProductDetails(proCode);
		$scope.productCodeNotFound(false);	
		}else{
		$scope.addProduct.itemCode=prod;
		$scope.productCodeNotFound(true);	
		}
		}
	}else{
	if (prod) {
	if (prod.code) {
	// $scope.addProduct.itemCode=prod.code;
	// console.log(prod.code);
	// var proCode=prod.code.replace(/\s+/g,'');
	var proCode=prod.code;
	console.log(proCode);
	$scope.getProductDetails(proCode);
	$scope.productCodeNotFound(false);	
	}else{
	$scope.productCodeNotFound(true);	
	}
	}
	}
	};
	//================Alternative Product================================
	$scope.altProductSavings=function(){
	var savings,altQuotePrice,altDiviser,price;
	altSupplierPrice=$scope.addProduct.currentSupplierPrice;
	altQuotePrice=$scope.addProduct.altProd.quotePrice;
	altDiviser = $scope.addProduct.altProd.unitDiviser;
	if (altSupplierPrice>0&&altQuotePrice>0) {
	// console.log(altSupplierPrice,altQuotePrice,altDiviser);
	price = altQuotePrice/altDiviser;
	if (altSupplierPrice==altQuotePrice) {
	savings=0;
	}else{
	savings=$scope.getPriceInPercentage(altSupplierPrice,price);		
	};	
	}else{
	savings=0;
	}
	return savings;
	};


	$scope.isAltProductValid=function(prod){
	var valid =false;
	if ($scope.search) {
	// console.log("1..............");
	// console.log("ST CODE",$scope.addProduct.itemCode)
	// console.log("Alt CODE",$scope.search.selectedAltProduct.code)
	if ($scope.addProduct.itemCode&&$scope.search.selectedAltProduct) {
	// console.log("2..............");
	if ($scope.addProduct.itemCode==$scope.search.selectedAltProduct.code) {
	// console.log("EQUAL")
	// console.log($scope.search.selectedProduct.code)
	// console.log($scope.search.selectedAltProduct.code)
	valid=false;
	}else{
	valid=true;
	}
	}
	}
	return valid;
	}
	$scope.isAltValid=true;
	$scope.altProductCodeChanged=function(prod){
	console.log("altProductCodeChanged");
	console.log(prod);
	if ($scope.isAltProductSelected) {
	$scope.altProductInfo=undefined;	
	$scope.addProduct.altProd={};	
	// $scope.priceArray=[];
	$scope.isAltProductSelected=false;
	if (prod) {
	if (prod.code) {
	// var proCode=prod.code.replace(/\s+/g,'');;
	var proCode=prod.code;
	console.log(proCode);
	}
	}
	}else{
	if (prod) {
	if (prod.code) {
	// $scope.addProduct.itemCode=prod.code;
	// console.log(prod.code);
	// var proCode=prod.code.replace(/\s+/g,'');
	var proCode=prod.code;
	console.log(proCode);
	$scope.isAltValid=$scope.isAltProductValid();

	if ($scope.isAltValid) {
	$scope.getAltProductDetails(proCode);	
	}
	}else{
	}
	}
	}
	};

	$scope.assignProductDetailsToAlt=function(product){
	// console.log("assignProductDetailsToAlt");
	// console.log(JSON.stringify(product));
	if ($scope.addProduct) {
	$scope.addProduct.altProd=angular.copy(product);
	$scope.addProduct.altProd.isAlternative='yes';
	$scope.altProductInfo=angular.copy($scope.addProduct.altProd);
	$scope.addProduct.altProd.quotePrice='';
	$scope.addProduct.altProd.itemQty=$scope.addProduct.itemQty;
	$scope.addProduct.altProd.unitDiviser=1;

	if (product.promoPrice) {
	$scope.addProduct.altProd.quotePrice=product.promoPrice;
	$scope.altSellingPriceChanged($scope.addProduct.altProd.quotePrice,$scope.addProduct.altProd.avgcost);
	};
	// $scope.addProduct.altProd.isAlternative=true;
	}
	}
	$scope.getAltProductDetails=function(productCode){
	$rootScope.showLoadSpinner();
	SQQuoteServices.GetAltProductDetails(productCode);
	// $http({
	// method: "POST",
	// url: "/smartquote/getProductDetails?productCode="+productCode,
	// }).success(function(data, status, header, config){
	// console.log(data)
	// if (data.code=="sessionTimeOut") {
	// $scope.addProductFromModal("sessiontimeout");
	// }else{
	// $rootScope.$broadcast('GetAltProductDetailsDone', data); 
	// }
	// }).error(function(data, status, header, config){
	// $rootScope.$broadcast('GetAltProductDetailsNotDone', data);
	// });

	}
	$scope.handleGetAltProductDetailsDoneResponse=function(data){
	if(data){
	if (data.code) {
	if(data.code.toUpperCase()=='SUCCESS'){
	console.log("getAltProductDetails");
	console.log(data.objProductResponseBean);
	$scope.assignProductDetailsToAlt(data.objProductResponseBean);
	$scope.alternativeProductPriceArray($scope.addProduct.altProd);
	$scope.addProduct.selectedAlternativeProduct='';
	$scope.isAltProductSelected=true;
	$scope.search.selectedAltProduct='';
	$rootScope.hideLoadSpinner();
	}else{
	
	$rootScope.hideLoadSpinner();
	}
	}
	}
	};
	var cleanupEventGetAltProductDetailsDone = $scope.$on("GetAltProductDetailsDone", function(event, message){
	if (message.code=="sessionTimeOut") {
	$scope.addProductFromModal("sessiontimeout");
	}else{
	$scope.handleGetAltProductDetailsDoneResponse(message);      
	};
	});

	var cleanupEventGetAltProductDetailsNotDone = $scope.$on("GetAltProductDetailsNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
	});
	//========================Search================

	

	//---------------------------

	


	$scope.clearSearch=function(){
	console.log($scope.search.selectedProduct);
	console.log($scope.addProduct.itemCode);
	if ($scope.isProductSelected) {
	$scope.search.selectedProduct="";
	}else{
	$scope.search.selectedProduct="";
	$scope.addProduct.itemCode="";
	}
	}
	//================ALternatives=====================
	$scope.checkedAlternate=function(){
	console.log("checkedAlternate");
	if ($scope.addProduct.isLinkedExact) {
	console.log("iffff")
	$scope.addProduct.altProd={};
	$scope.addProduct.altProd.itemQty=$scope.addProduct.itemQty;
	$scope.addProduct.altProd.unitDiviser=1;
	console.log($scope.addProduct.itemQty)
	}else{
	console.log("elseeee")
	$scope.addProduct.selectedAlternativeProduct={};
	$scope.addProduct.altProd=undefined;
	$scope.search.selectedAltProduct="";
	}
	};

	$scope.validateAltSellingPrice=function(){
	if ($scope.addProduct.altProd.avgcost) {
		console.log("validateAltSellingPrice")
	var price =parseFloat($scope.addProduct.altProd.quotePrice);
	var cost =$scope.addProduct.altProd.avgcost;
	if (parseFloat(price)>=parseFloat(cost)) {
	// console.log("isSellingPriceValid")	
	$scope.isAltSellingPriceInvalid=false;
	}else{
	// console.log("isSellingPriceInvalid")
	$scope.isAltSellingPriceInvalid=true;
	}
	}	
	};
	$scope.altSellingPriceChanged=function(price,cost){
	// console.log("altSellingPriceChanged");
	var price1=price;
	var cost1=cost;
	if (price1==0){
	$scope.addProduct.altProd.gpRequired=0;
	}else{
	$scope.addProduct.altProd.gpRequired=$scope.getPriceInPercentage(price1,cost1);
	}
	};

	$scope.altGpRequiredChanged=function(cost,gprequired){
	// console.log("altGpRequiredChanged");
	// console.log(cost,gprequired);
	if (gprequired) {
	var sellingPrice=$scope.getSellingPrice(cost,gprequired);
	if ($scope.form.addProductIntoQuote.altProductQuotePrice.$valid) {
	$scope.addProduct.altProd.quotePrice=sellingPrice;	
	}else{
	$scope.addProduct.altProd.quotePrice=0;
	}
	}else{
	$scope.addProduct.altProd.quotePrice=0;
	}
	};

	$scope.alternativeProductPriceArray=function(altProd){
	var price=[];
	var qty=[];
	$scope.altPriceArray=[];
	$scope.altQuantityArray=[];
	if (altProd.price0exGST || altProd.price1exGST || altProd.price2exGST || altProd.price3exGST || altProd.price4exGST) {	
	price.push(altProd.price0exGST.toString());
	price.push(altProd.price1exGST.toString());
	price.push(altProd.price2exGST.toString());
	price.push(altProd.price3exGST.toString());
	price.push(altProd.price4exGST.toString());
	angular.forEach(price, function(value, key){
	if (value==price[key+1]) {
	}else{
	$scope.altPriceArray.push(value);
	}
	});
	}
	if (altProd.qtyBreak0 || altProd.qtyBreak1 || altProd.qtyBreak2 || altProd.qtyBreak3 || altProd.qtyBreak4) {	
		qty.push(altProd.qtyBreak0.toString());
		qty.push(altProd.qtyBreak1.toString());
		qty.push(altProd.qtyBreak2.toString());
		qty.push(altProd.qtyBreak3.toString());
		qty.push(altProd.qtyBreak4.toString());
		angular.forEach(qty, function(value, key){
		if (value==qty[key+1]) {
		}else{
		$scope.altQuantityArray.push(value);
		}
		});
		}
	}
	$scope.alternativeProductSelected=function(altProd){
	console.log("alternativeProductSelected");
	console.log(altProd)
	if (altProd) {
	$scope.alternativeProductPriceArray(altProd);
	$scope.assignAltToAddProduct(altProd);
	$scope.search.selectedAltProduct='';
	}
	};
	$scope.assignAltToAddProduct=function(altProd){
	if (altProd) {
	$scope.addProduct.altProd=angular.copy(altProd)
	if (altProd.promoPrice>0) {
	$scope.addProduct.altProd.quotePrice=altProd.promoPrice;
	}else{
	$scope.addProduct.altProd.quotePrice=null;	
	}
	$scope.addProduct.altProd.itemQty=$scope.addProduct.itemQty;
	$scope.addProduct.altProd.unitDiviser=1;
	$scope.addProduct.altProd.isAlternative='yes';
	$scope.altProductInfo=angular.copy($scope.addProduct.altProd);
	}	
	};
	$scope.radius=125;
	$scope.getStyle = function(){
	var transform = 'translateY(-50%) ' + 'translateX(-50%)';
	return {
	'top': '50%',
	'bottom': 'auto',
	'left': '50%',
	'transform': transform,
	'-moz-transform': transform,
	'-webkit-transform': transform,
	'font-size': 16 + 'px',
	'font-weight': 'bold',
	}
	};

	$scope.getSavingStyle = function(){
	var value=parseFloat($scope.productSavings())+5;
	return value.toFixed(2);
	};

	$scope.getAltSavingStyle = function(){
	var value=parseFloat($scope.altProductSavings())+5;
	return value.toFixed(2);    	
	};

	$scope.getNegativeAltSavingStyle = function(){
	var value=parseFloat(Math.abs($scope.altProductSavings()))+5;
	// console.log("getNegativeAltSavingStyle :: "+ value)
	return value;    	
	};



	// $scope.productSavingsNegative=function(){
	// var savings ;
	// if ($scope.addProduct.currentSupplierPrice>0&&$scope.addProduct.quotePrice>0) {
	// savings=$scope.getPriceInPercentage($scope.addProduct.currentSupplierPrice,$scope.addProduct.quotePrice);
	// return Math.abs(savings);
	// }
	// };
//==========EDIT===========================
$scope.isAltUnitDiviserClicked=function(){
	console.log($scope.addProduct.altProd.isAltUnitDiviser);
	if ($scope.addProduct.altProd.isAltUnitDiviser) {
		// $scope.addProduct.altProd.unitDiviser=1;
	} else{
		$scope.addProduct.altProd.unitDiviser=1;
	};
}
$scope.checkEditAlt=function(){
console.log("checkEditAlt...")
if ($scope.addProduct.alternativeProductList) {
$scope.select.type='select';
$scope.alternativeProductList=$scope.addProduct.alternativeProductList;
};
if ($scope.addProduct.altProd) {
$scope.altProductInfo=$scope.addProduct.altProd;

angular.forEach($scope.alternativeProductList, function(value, key){
if (value.itemCode.toUpperCase()==$scope.addProduct.altProd.itemCode.toUpperCase()) {
$scope.addProduct.selectedAlternativeProduct=value;
}
});
$scope.alternativeProductPriceArray($scope.addProduct.altProd);
if($scope.addProduct.altProd.unitDiviser > 1){
$scope.addProduct.altProd.isAltUnitDiviser = true;
}else{
$scope.addProduct.altProd.isAltUnitDiviser = false;
};
}
if ($scope.addProduct.altProd&&$scope.addProduct.alternativeProductList==null) {
$scope.select.type='search';
};
};


$scope.initEdit=function(){
	console.log("initEdit...")
	console.log("dataToModal")
	console.log(dataToModal);
	$scope.addProduct=dataToModal.product;
	if ($scope.addProduct.lineComment) {
		$scope.addProduct.addComment=true;
	}else{
		$scope.addProduct.addComment=false;
	}
	$scope.productInfo=dataToModal.product;
	$scope.createArrayOfQuantityAndPrice(dataToModal.product);
	$scope.isNewProduct=$scope.addProduct.isNewProduct;
	var productGroupCode=$scope.addProduct.productGroupCode;

	$scope.productGroupList.forEach(function(element,index){
	if ($scope.addProduct.productGroupCode){
	if ($scope.addProduct.productGroupCode.code) {
	if(element.code==$scope.addProduct.productGroupCode){
	productGroupCode=element;
	}	
	}else{
	productGroupCode=element;
	}
	}	
	});
	$scope.addProduct.productGroup=productGroupCode;

	$scope.checkEditAlt();

};

	var products;
	if ($scope.productButtonStatus=='edit') {
	$scope.initEdit();	
	}else{
	// document.getElementById("#searchProduct").focus();
	}
	//================ADD Line Comment=====================
	$scope.deleteLineComment=function(){
		if ($scope.addProduct.addComment) {
		$scope.addProduct.lineComment=null;
		$scope.addProduct.addComment= false;
		} else{
			
		};
	}
	$scope.checkedLineComments=function(){
	console.log("checkedLineComments")
	if ($scope.addProduct.addComment) {
	swal({
	  title: "",
	  text: "",
	  type: "input",
	  showCancelButton: true,
	  closeOnConfirm: true,
	  animation: "slide-from-top",
	  inputPlaceholder: "add line comment"
	},
	function(inputValue){
	  if (inputValue === false){
	  	console.log(" inputValue false")
	  	$scope.addProduct.addComment= !$scope.addProduct.addComment
	  	$scope.addProduct.lineComment=null;
	  	return false;
	  } 
	  if (inputValue === "") {
	  	$scope.addProduct.lineComment=null;
	  	$scope.addProduct.addComment= !$scope.addProduct.addComment
	    // swal.showInputError("You need to add line comment!");
	    return false
	  }
	  $scope.addProduct.lineComment=inputValue;
	  
	  // swal("Nice!", "You wrote: " + inputValue, "success");
	});
	} else{
		$scope.addProduct.lineComment=null;
	};
	
	};
	
	//================HOTKEYS=====================
	hotkeys.bindTo($scope)
	.add({
	combo: 'escape',
	description: 'Clear Search ',
	allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
	callback: function() {
	console.log("Escape pressed")
	$scope.clearSearch();
	$('#searchProduct').focus();
	}
	});
	$scope.$on('$destroy', function(event, message) {
	cleanupEventGetProductDetailsDone();
	cleanupEventGetProductDetailsNotDone();
	// cleanupEventGetAlternativeProductListDone();
	// cleanupEventGetAlternativeProductListNotDone();
	});
	})
	.directive('autofocus', ['$timeout', function($timeout) {
	return {
	restrict: 'A',
	link : function($scope, $element) {
	$timeout(function() {
	$element[0].focus();
	});
	}
	}
	}]);
