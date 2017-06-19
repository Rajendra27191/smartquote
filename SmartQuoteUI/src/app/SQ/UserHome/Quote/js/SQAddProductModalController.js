	angular.module('sq.SmartQuoteDesktop')
	.controller('SQAddProductModalController',function($uibModalInstance,dataToModal,$scope,$rootScope,hotkeys,SQUserHomeServices,$uibModal,$http){
	console.log('initialise SQAddProductModalController');

	$scope.form={};
	$scope.addProduct={};
	$scope.addProduct.gstFlag='NO'
	$scope.customerQuote={};
	$scope.isNewProduct=false;
	console.log(dataToModal);

	$scope.customerQuote=dataToModal.customerQuote;
	$scope.productButtonStatus=dataToModal.productButtonStatus;
	$scope.productList=dataToModal.productList;
	$scope.productGroupList=dataToModal.productGroupList;
	$scope.isAddProductModalShow=dataToModal.isAddProductModalShow;

	$scope.modelOptions = {
	debounce: {
	default: 500,
	blur: 250
	},
	getterSetter: true
	};


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
	var dataFromModal;
	dataFromModal={
	'addProduct':$scope.addProduct,
	'addNextProduct':addNextProduct,
	'productButtonStatus':$scope.productButtonStatus,
	'isNewProduct':$scope.isNewProduct,
	'isAddProductModalShow':false,
	}
	$uibModalInstance.close(dataFromModal);
	}else{
	console.log("Invalid product data");		
	$('#quotePrice').focus();
	$scope.isSellingPriceInvalid=true;	
	// $scope.form.addProductIntoQuote.price0exGST.$invalid=true;
	}
	}else{
	$scope.form.addProductIntoQuote.submitted=true;
	}
	}

	$rootScope.addNextProduct=function(){
	var addNextProduct=true;	
	// console.log("addNextProduct")
	$scope.addProductFromModal(addNextProduct);
	};

	$rootScope.saveAndClose=function(){
	var addNextProduct=false;	
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

	$scope.getProductDetails=function(product){
	// console.log(product);
	// $rootScope.showSpinner();
	$rootScope.showLoadSpinner();
	SQUserHomeServices.GetProductDetails(product.code);
	};

	$scope.handleGetProductDetailsDoneResponse=function(data){
	if(data){
	if (data.code) {
	if(data.code.toUpperCase()=='SUCCESS'){
	console.log("getProductDetails");
	console.log(data.objProductResponseBean);	
	$scope.addProduct=angular.copy(data.objProductResponseBean);
	$scope.addProduct.quotePrice=null;
	$scope.productInfo=angular.copy(data.objProductResponseBean);
	$scope.addProduct.itemQty=1;
	if ($scope.addProduct.gstFlag.toUpperCase()=='NO') {
	$scope.disableCurrentSupplierGP=true;	
	};
	$scope.createArrayOfQuantityAndPrice($scope.addProduct);
	$scope.isProductSelected=true;
	}else{
	$rootScope.alertError(data.message);
	}
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
	 console.log("productCodeNotFound")
	 console.log(noProductFound)
	if (noProductFound!=undefined) {
	if ($scope.productButtonStatus=='add') {
	$scope.isNewProduct=noProductFound;
	}
	}
	};

	//=================
	$scope.getLocation = function(val) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
    	console.log(response)	
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };

    $scope.getProductListData=function(val){
    console.log("getProductListData")
     return $http.get('/smartquote/getProductList', {
      params: {
        prodLike: val,
      }
    }).then(function(response){
    console.log(response)	
        return response.data.results;
    });
     // $http({
     //  method: "POST",
     //  url: "/smartquote/getProductList?prodLike="+prodLike,
     //  }).success(function(data, status, header, config){
     //    // console.log(data)
     //    if (data.code=="sessionTimeOut") {
     //    $rootScope.$broadcast('SessionTimeOut', data);   
     //    }else{
     //    console.log("returning")
     //    $scope.productList=data.result;
     //    console.log($scope.productList)
     //    return $scope.productList;
     //    }
     //  }).error(function(data, status, header, config){
     //    //console.log(data);
     //    $rootScope.$broadcast('GetProductListNotDone', data);
     //  });
    }

	$scope.getProductsList=function(prod){
	$rootScope.showSpinner();
	var prodLike=prod;
	SQUserHomeServices.GetProductList(prodLike);
	}
	$scope.handleGetProductListDoneResponse=function(data){
	if(data){
	if (data.code){
	if(data.code.toUpperCase()=='SUCCESS'){
	$scope.productList=data.result;
	angular.element('#upload').trigger('change');
	}else{
	$rootScope.hideLoadSpinner();
	$rootScope.alertError(data.message);
	}
	$rootScope.hideLoadSpinner();
	}
	}
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
	//=================
	$scope.isLoading=false;
	$scope.productCodeChanged=function(prod){
	if ($scope.isProductSelected) {
	var code=$scope.addProduct.itemCode;	
	$scope.addProduct={};
	$scope.productInfo=undefined;
	$scope.addProduct.itemCode=code;
	$scope.priceArray=[];
	// $scope.isProductInvalid=true;
	}else{
		// console.log("productCodeChanged");
		// console.log(prod)
		// console.log($scope.addProduct.itemCode);
		// if($scope.addProduct.itemCode!=undefined){
		// console.log($scope.addProduct.itemCode.length);
		// if ($scope.addProduct.itemCode.length==2) {
		// $scope.getProductsList($scope.addProduct.itemCode);			
		// }
		// }
	}
	};


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
	
// $scope.myCustomFilter=function(product){
// }
	$scope.$on('$destroy', function(event, message) {
	cleanupEventGetProductDetailsDone();
	cleanupEventGetProductDetailsNotDone();

	});
})
	;