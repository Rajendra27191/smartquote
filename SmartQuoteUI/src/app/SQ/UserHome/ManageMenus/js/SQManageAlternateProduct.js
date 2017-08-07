angular.module('sq.SmartQuoteDesktop')
.controller('SQManageAlternateProductController',['$scope','$rootScope','$log','$state','$timeout','$http','SQHomeServices','SQUserHomeServices','hotkeys','SQManageMenuServices',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,SQUserHomeServices,hotkeys,SQManageMenuServices){
	console.log('initialise SQManageAlternateProductController controller');

	$scope.addAlternateProductBtnShow=true;
	$scope.isAlternateProductTableView=true;
	$scope.showAddEditView=false;
	$scope.buttonstatus='add';

	$scope.search={};
	$scope.productDetails={};
	$scope.alternateProductList=[];
	$scope.alternateProductListView=[];
	// $scope.milestone_data = { index: 0 };	

//Search Code=============================================================
$scope.setMainProduct= function(product) {
  $scope.alternateProductList.forEach(function(prod){
  	prod.isMainProduct=product===prod
  });
  console.log($scope.alternateProductList)
};
$scope.initAuotoComplete=function(){
	// $scope.selectedProduct=null;
	products = new Bloodhound({
		datumTokenizer:function(d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: {
			url: "smartquote/products.json?query=%QUERY",
			cache: false,
			filter: function (devices) {
				return $.map(devices, function (device) {
					return {
						code: device.code,
						value : device.value
					};
				});
			}
		},
	});
	products.initialize();
	$rootScope.productsDataset = {
		displayKey: 'value',
		limit: 200,
		source: products.ttAdapter(),
	};

	$rootScope.exampleOptions = {
		displayKey: 'title',
		highlight: true
	};
	
	$timeout(function() {
		$rootScope.hideSpinner();
	}, 500);
}
//================================================================================================
$scope.resetSearch=function(){
	$scope.search.selectedProduct="";
	$('#searchProduct').focus();
};

$scope.addProductToAlternateProductList=function(product){
// console.log("mainProductCodeChanged");
// console.log(product);
if (product) {
	if (product.code) {
		if ($scope.alternateProductList) {
			if ($scope.alternateProductList.length>0) {
				var isProductExist=false;
				angular.forEach($scope.alternateProductList, function(value, key){
					if (value.itemCode.toUpperCase()==product.code) {
						isProductExist=true;
					}
				});
				if (isProductExist) {
					console.log("duplicate product")
					$rootScope.SQNotify("Duplicate product entry",'error'); 
					$scope.resetSearch();
				}else{
					$scope.getProductDetails(product)				
				}
			}else{
				$scope.getProductDetails(product)				
			}
		}
	}
}
};
$scope.deleteAlternateProduct=function(index){
console.log("deleteAlternateProduct")
if ($scope.alternateProductList.length>0) {
if ($scope.alternateProductList.length==1) {
$rootScope.SQNotify("Can not delete all products",'error');
} else {
$scope.alternateProductList.splice(index,1);
}
}
};


//=====================================
$scope.pushDetailsToAlternateProductList=function(product){
	$scope.alternateProductList.push(product);	
	console.log($scope.alternateProductList)	
};
$scope.getProductDetails=function(prod){
	$rootScope.showSpinner();
	SQUserHomeServices.GetProductDetails(prod.code)
};
$scope.handleGetProductDetailsDoneResponse=function(data){
	$scope.productDetails={};
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				console.log("getProductDetails");
				console.log(data.objProductResponseBean);
				$scope.productDetails=data.objProductResponseBean;
				$scope.productDetails.isMainProduct=false;
				$scope.pushDetailsToAlternateProductList($scope.productDetails);
				$scope.resetSearch();
				$rootScope.hideSpinner();
			};
		}
	}
};
var cleanupEventGetProductDetailsDone = $scope.$on("GetProductDetailsDone", function(event, message){
	$scope.handleGetProductDetailsDoneResponse(message);      
});

var cleanupEventGetProductDetailsNotDone = $scope.$on("GetProductDetailsNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
});
//=====================================
$scope.jsonToSaveAlternateProducts=function(){
	var obj={};
	obj.mainProductCode='';
	obj.alternativeProductCodeList=[];
	angular.forEach($scope.alternateProductList, function(value, key){
		var product={};
		if (value.isMainProduct) {
			// product={mainProductId:value.itemCode}
			obj.mainProductCode=angular.copy(value.itemCode);
		} else {
			product={alternateProductId:value.itemCode}
			obj.alternativeProductCodeList.push(value.itemCode);
		}
	});
	return obj;
};
$scope.saveAlternateProducts=function(){
	console.log("saveAlternateProducts")
	console.log($scope.alternateProductList)
	console.log($scope.alternateProductList.length)
	if ($scope.alternateProductList.length>0) {
		var isMainProductExist=false;
		angular.forEach($scope.alternateProductList, function(value, key){
			if (value.isMainProduct) {
				isMainProductExist=true;
			}
		});
		if (isMainProductExist) {
			if ($scope.alternateProductList.length>1) {
		// console.log(JSON.stringify($scope.jsonToSaveAlternateProducts()));;
		$rootScope.showSpinner();
		SQManageMenuServices.CreateAlternateProducts(JSON.stringify($scope.jsonToSaveAlternateProducts()))
	} else {
		// $scope.alertError("Please add more than 1 product");
		$rootScope.SQNotify("Please add more than 1 product",'error');
	}

} else {
	// $scope.alertError("Please select main product");
	$rootScope.SQNotify("Please select main product",'error');
}
} else {
	$rootScope.alertError("Please add products");
	$scope.resetSearch();
}
};
$scope.handleCreateAlternativeProductDoneResponse=function(data){
	$scope.productDetails={};
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				swal({
					title: "Success",
					text: "Successfully saved alternative product!",
					type: "success",
				},function(){
					$scope.alternateProductList=[];
					$scope.resetAlternateProducts();

				});
				$rootScope.hideSpinner();
			};
		}
	}
};
var cleanupEventCreateAlternativeProductDone = $scope.$on("CreateAlternativeProductDone", function(event, message){
	$scope.handleCreateAlternativeProductDoneResponse(message);      
});

var cleanupEventCreateAlternativeProductNotDone = $scope.$on("CreateAlternativeProductNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
});

$scope.addAlternateProductBtnClicked=function(){
	$scope.addAlternateProductBtnShow=false;
	$scope.isAlternateProductTableView=false;
	$scope.showAddEditView=true;
	$scope.buttonstatus='add';
	$scope.showSpinner();
	$scope.initAuotoComplete();
	$scope.alternateProductList=[];
	// $scope.addProductGroupBtnShow=false;
};
$scope.resetAlternateProducts=function(){
	$scope.addAlternateProductBtnShow=true;
	$scope.isAlternateProductTableView=true;
	$scope.showAddEditView=false;
	$scope.buttonstatus='add';
	$scope.getAlternateProductsView();
}

$scope.cancelAlternateProducts=function(){
	$scope.resetAlternateProducts();
};
//===================Get LIST==========================
$scope.getAlternateProductsView=function(){
$rootScope.showSpinner()
SQManageMenuServices.GetAlternateProductsView();
}
$scope.handleGetAlternateProductsViewDoneResponse=function(data){
	$scope.productDetails={};
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				$scope.alternateProductListView=data.objAlternateProductBeans;
				$rootScope.hideSpinner();
			};
		}
	}
};
var cleanupEventGetAlternateProductsViewDone = $scope.$on("GetAlternateProductsViewDone", function(event, message){
	$scope.handleGetAlternateProductsViewDoneResponse(message);      
});

var cleanupEventGetAlternateProductsViewNotDone = $scope.$on("GetAlternateProductsViewNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
});

$scope.getAlternateProductsView();
//====================Delete Alternate product==============================================
$scope.deleteAlternateProductFromList=function(product){
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
	 SQManageMenuServices.DeleteAlternateProduct(product.mainProductCode,product.altProductCode);
	} 
	});
// $rootScope.showSpinner()
}
$scope.handleDeleteAlternateProductDoneResponse=function(data){
	$scope.productDetails={};
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				// $scope.alternateProductListView=data.objAlternateProductBeans;	
				$rootScope.alertSuccess("Successfully deleted alternate product !");
				$scope.getAlternateProductsView();
				$rootScope.hideSpinner();
			};
		}
	}
};
var cleanupEventDeleteAlternateProductDone = $scope.$on("DeleteAlternateProductDone", function(event, message){
	$scope.handleDeleteAlternateProductDoneResponse(message);      
});

var cleanupEventDeleteAlternateProductNotDone = $scope.$on("DeleteAlternateProductNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
});

//===============================================================================
hotkeys.bindTo($scope)
.add({
	combo: 'escape',
	description: 'Clear Search ',
	allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
	callback: function() {
		console.log("Escape pressed")
		$scope.resetSearch();
	}
});

$scope.$on('$destroy', function(event, message) {
	cleanupEventGetProductDetailsDone();
	cleanupEventGetProductDetailsNotDone();
	cleanupEventCreateAlternativeProductDone();
	cleanupEventCreateAlternativeProductNotDone();
	cleanupEventDeleteAlternateProductDone();
	cleanupEventDeleteAlternateProductNotDone();
});

}]);