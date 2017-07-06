	angular.module('sq.SmartQuoteDesktop')
	.controller('SQAddProductModalController',function($uibModalInstance,dataToModal,$scope,$rootScope,hotkeys,SQUserHomeServices,$uibModal,$http,hotkeys){
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


	$scope.addProductFromModal=function(addNextProduct){
	 console.log("addProductFromModal")
	 console.log($scope.form.addProductIntoQuote)	
	if ($scope.form.addProductIntoQuote.$valid) {
		console.log($scope.addProduct.quotePrice)	
		console.log($scope.addProduct.avgcost)	
	if (parseFloat($scope.addProduct.quotePrice)>=parseFloat($scope.addProduct.avgcost)) {
	console.log("Valid product data");
	dataFromModal={
	'addProduct':$scope.addProduct,
	'addNextProduct':addNextProduct,
	'productButtonStatus':$scope.productButtonStatus,
	'isNewProduct':$scope.isNewProduct,
	'isAddProductModalShow':false,
	}
	var dataFromModal;
	if(addNextProduct.toLowerCase()=="addnextproduct") {
		if (quoteStatus=='create') {
		$rootScope.addProductToQuote(dataFromModal);
		}else if(quoteStatus=='edit'){
		$rootScope.addProductToEditQuote(dataFromModal);
		}
		$scope.addProduct={};
		$scope.productInfo=undefined;
		$scope.form.addProductIntoQuote.submitted=false;
		$scope.form.addProductIntoQuote.$setPristine();
		$scope.priceArray=[];
		$scope.search.selectedProduct="";
		$('#searchProduct').focus();	
	}else if(addNextProduct.toLowerCase()=="saveclose"){
	$uibModalInstance.close(dataFromModal);
	}
	}else{
	console.log("Invalid product data");		
	$('#quotePrice').focus();
	$scope.isSellingPriceInvalid=true;	
	// $scope.form.addProductIntoQuote.price0exGST.$invalid=true;
	}
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
	}}
	
	}

	}

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
	if (price1>=cost1){
	$scope.addProduct.gpRequired=$scope.getPriceInPercentage(price1,cost1);
	}else{
	$scope.addProduct.gpRequired=0;
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
	if ($scope.form.addProductIntoQuote.currentSupplierPrice.$valid) {
	$scope.addProduct.currentSupplierGP=$scope.getPriceInPercentage(price,cost);
	}else{
		$scope.addProduct.currentSupplierGP=0;
	}
	};
	$scope.productSavings=function(){
	var savings ;
	if ($scope.addProduct.currentSupplierPrice>0&&$scope.addProduct.quotePrice>0 && $scope.addProduct.currentSupplierPrice>$scope.addProduct.quotePrice) {
	savings=$scope.getPriceInPercentage($scope.addProduct.currentSupplierPrice,$scope.addProduct.quotePrice);
	return savings;
	}else{
	return 0;
	}
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
	// SQUserHomeServices.GetProductDetails(productCode);
	 $http({
      method: "POST",
      url: "/smartquote/getProductDetails?productCode="+productCode,
      }).success(function(data, status, header, config){
        //console.log(data)
        if (data.code=="sessionTimeOut") {
        // $rootScope.$broadcast('SessionTimeOut', data);
        $scope.addProductFromModal("sessiontimeout");
        }else{
        $rootScope.$broadcast('GetProductDetailsDone', data); 
        }
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('GetProductDetailsNotDone', data);
      });
	};

	$scope.handleGetProductDetailsDoneResponse=function(data){
	if(data){
	if (data.code) {
	if(data.code.toUpperCase()=='SUCCESS'){
	console.log("getProductDetails");
	console.log(data.objProductResponseBean);	
	$scope.addProduct=angular.copy(data.objProductResponseBean);
	$scope.addProduct.quotePrice='';
	$scope.productInfo=angular.copy(data.objProductResponseBean);
	$scope.addProduct.itemQty=1;
	$scope.addProduct.currentSupplierPrice='';
	$scope.addProduct.currentSupplierGP='';
	$scope.addProduct.gpRequired='';
	$scope.selectedProduct="";
	if ($scope.addProduct.gstFlag.toUpperCase()=='NO') {
	$scope.disableCurrentSupplierGP=true;	
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

	var cleanupEventGetProductDetailsDone = $scope.$on("GetProductDetailsDone", function(event, message){
	$scope.handleGetProductDetailsDoneResponse(message);      
	});

	var cleanupEventGetProductDetailsNotDone = $scope.$on("GetProductDetailsNotDone", function(event, message){
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
	$scope.addProduct.itemCode=code;
	$scope.priceArray=[];
	$scope.isProductSelected=false;
	// $scope.isProductInvalid=true;
	if (prod) {
		 	if (prod.code) {
		 		// console.log(prod.code);
		 		$scope.addProduct.itemCode=prod.code;
		 		var proCode=prod.code.replace(/\s+/g,'');;
		 		// console.log(proCode);
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
		 		$scope.addProduct.itemCode=prod.code;
		 		// console.log(prod.code);
		 		var proCode=prod.code.replace(/\s+/g,'');
		 		console.log(proCode);
		 		$scope.getProductDetails(proCode);
		 		$scope.productCodeNotFound(false);	
		 	}else{
		 		$scope.productCodeNotFound(true);	
		 	}
		 }
	}
	};
//========================Search
	
	var products;
	if ($scope.productButtonStatus=='edit') {
	console.log(dataToModal.product)
	$scope.addProduct=dataToModal.product;
	$scope.productInfo=dataToModal.product;
	$scope.createArrayOfQuantityAndPrice(dataToModal.product);
	$scope.isNewProduct=$scope.addProduct.isNewProduct;

	var productGroupCode=$scope.addProduct.productGroupCode;
	$scope.productGroupList.forEach(function(element,index){
		if ($scope.addProduct.productGroupCode){
		if ($scope.addProduct.productGroupCode.code) {
			if(element.code==$scope.addProduct.productGroupCode){
			console.log(element)
			productGroupCode=element;
			}	
		}else{
			console.log(",,,,,,,,,,,,,,");
			productGroupCode=element;
		}
	 }	
	});
	$scope.addProduct.productGroup=productGroupCode;
	// console.log($scope.addProduct.productGroup)
	}else{
		 // document.getElementById("#searchProduct").focus();

	}
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
//================HOTKEYS=====================
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
        // 'font-size': $scope.radius/ + 'px'
    };

    hotkeys.bindTo($scope)
	.add({
	  combo: 'escape',
	  description: 'Clear Search ',
	  allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
	  callback: function() {
	  	console.log("Escape pressed")
	  	$scope.clearSearch();
	  }
	});


	$scope.$on('$destroy', function(event, message) {
	cleanupEventGetProductDetailsDone();
	cleanupEventGetProductDetailsNotDone();

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