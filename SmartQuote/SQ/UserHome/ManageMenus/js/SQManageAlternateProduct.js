angular.module('sq.SmartQuoteDesktop')
.controller('SQManageAlternateProductController',['$scope','$rootScope','$log','$state','$timeout','$http','SQHomeServices','SQManageMenuServices','hotkeys','SQManageMenuServices',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,SQManageMenuServices,hotkeys,SQManageMenuServices){
	console.log('initialise SQManageAlternateProductController controller');

	$scope.addAlternateProductBtnShow=true;
	$scope.isAlternateProductTableView=true;
	$scope.showAddView=false;
	$scope.buttonstatus='add';

	$scope.search={};
	$scope.productDetails={};
	$scope.alternateProductList=[];
	$scope.alternateProductListView=[];
	$scope.form={};

	// $scope.milestone_data = { index: 0 };	

//Search Code=============================================================
$scope.editing = [];
$scope.showDetails=function(alternateProductListView,index){
// console.log(termConditionList);	
// console.log(index);
if ($scope.editing[index]==true) {
	 $scope.editing[index] = false;
}else{
	for(var i=0;i<alternateProductListView.length;i++){
        if(i == index){
          $scope.editing[i] = true;
        }else{
          $scope.editing[i] = false;
        }
      }    	
};	
};
$scope.stop = function(index){
  $scope.editing[index] = false;
};
//Search Code=============================================================
$scope.setMainProduct= function(product) {
  $scope.alternateProductList.forEach(function(prod){
  	prod.isMainProduct=product===prod;
  	if (prod.isMainProduct) {
  	// prod.defaultPrice=null;	
  	};
  });
  // console.log($scope.alternateProductList)
};
$scope.initAuotoComplete=function(){
	// $scope.selectedProduct=null;
	products = new Bloodhound({
		datumTokenizer:function(d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: {
			// url: "/smartquote/products.json?query=%QUERY",
			url: "/smartquote/products.json?query=%QUERY",
			cache: false,
			beforeSend: function(xhr){
          	$rootScope.showSpinner()
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
	// products.clearRemoteCache();
	products.clearPrefetchCache();
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
	
	// $timeout(function() {
	// 	$rootScope.hideSpinner();
	// }, 500);
}
//================================================================================================
$scope.resetSearch=function(){
	$scope.search.selectedProduct="";
	$('#searchProduct').focus();
};

$scope.addProductToAlternateProductList=function(product){
console.log("addProductToAlternateProductList");
console.log(product);
if (product) {
	if (product.code) {
		if ($scope.alternateProductList) {
			if ($scope.alternateProductList.length>0) {
				var isProductExist=false;
				angular.forEach($scope.alternateProductList, function(value, key){
					if (value.itemCode==product.code) {
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
var product={};
if ($scope.alternateProductList.length>0) {
if ($scope.alternateProductList.length==1) {
$rootScope.SQNotify("Can not delete all products",'error');
} else {
if ($scope.buttonstatus=='edit') {
// var altID=$scope.alternateProductList[index].itemCode;
product.altProductObj={altProductCode:$scope.alternateProductList[index].itemCode};
var mainID;
angular.forEach($scope.alternateProductList, function(listProd, key){
	if (listProd.isMainProduct) {
		// mainID=listProd.itemCode;
		product.mainProductCode=listProd.itemCode;
	};
});
// console.log(product)
$scope.deleteAlternateProductFromList(product,index);

}else{
$scope.alternateProductList.splice(index,1);
}
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
	SQManageMenuServices.GetProductDetails(prod.code)
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
				//---Promo price 
				// $scope.productDetails.defaultPrice=$scope.productDetails.promoPrice;
				//---Promo price 
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
	obj.alternativeProductList=[];
	angular.forEach($scope.alternateProductList, function(value, key){
		var product={};
		if (value.isMainProduct) {
			// product={mainProductId:value.itemCode}
			obj.mainProductCode=angular.copy(value.itemCode);
		} else {
			product={altProductCode:value.itemCode}
			// obj.alternativeProductList.push(value.itemCode);
			// product={altProductCode:value.itemCode, altProductDefaultPrice :value.defaultPrice }
			obj.alternativeProductList.push(product);
		}
	});
	return obj;
};
$scope.createAlternateProducts=function(){
	console.log("createAlternateProducts");
	// console.log(JSON.stringify($scope.jsonToSaveAlternateProducts()));
	$rootScope.showSpinner();
	SQManageMenuServices.CreateAlternateProducts(JSON.stringify($scope.jsonToSaveAlternateProducts()))
}
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


$scope.saveAlternateProducts=function(){
	console.log("saveAlternateProducts")
	console.log($scope.alternateProductList)
	console.log($scope.alternateProductList.length);
	if ($scope.form.edit.$valid) {
	console.log("Valid");
	// console.log($scope.form.edit);
	if ($scope.alternateProductList.length>0) {
	var isMainProductExist=false;
	angular.forEach($scope.alternateProductList, function(value, key){
	if (value.isMainProduct) {
	isMainProductExist=true;
	}
	});
	if (isMainProductExist) {
	if ($scope.alternateProductList.length>1) {

	console.log(JSON.stringify($scope.jsonToSaveAlternateProducts()));
	if ($scope.buttonstatus=='add') {
		$scope.createAlternateProducts();
	};
	if ($scope.buttonstatus=='edit') {
		$scope.editAlternateProducts();
	};
	
	} else {
	$rootScope.SQNotify("Please add more than 1 product",'error');
	}
	} else {
	$rootScope.SQNotify("Please select main product",'error');
	}
	} else {
	$rootScope.alertError("Please add products");
	$scope.resetSearch();
	}
	}else{
	console.log("inValid");
	console.log($scope.form.edit)
	$scope.form.edit.submitted=true;

	};
// 	
};


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
	// $scope.resetAlternateProducts();
	$scope.addAlternateProductBtnShow=true;
	$scope.isAlternateProductTableView=true;
	$scope.showAddEditView=false;
	$scope.buttonstatus='add';
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
$scope.deleteAlternateProductFromList=function(product,index){
	var previousWindowKeyDown = window.onkeydown;
	swal({
	title: 'Are you sure?',
	text: "You will not be able to recover this product after cancel update!",
	showCancelButton: true,
	closeOnConfirm: false,
	}, function (isConfirm) {
	window.onkeydown = previousWindowKeyDown;
	if (isConfirm) {
	 $rootScope.showSpinner();
	 SQManageMenuServices.DeleteAlternateProduct(product.mainProductCode,product.altProductObj.altProductCode);
	 $scope.alternateProductList.splice(index,1);
	}else{

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

//=================== EditMainAlternateProduct=====================
$scope.createEditAlternativeArray=function(product){
	var array=[];
	var obj={}
	var mainProductAdded=false;
	console.log("ALT PRODUCT :::");
	console.log(product);
	// angular.forEach($scope.alternateProductListView, function(listProd, key){
	// 	if (listProd.mainProductCode==product.mainProductCode) {
	// 		console.log("1...............")
	// 		var altProduct={}
	// 		if (!mainProductAdded) {
	// 			console.log("2...............")
	// 			var mainProduct={
	// 			'itemCode':product.mainProductCode,'itemDescription': product.mainProductDesc,
	// 			'unit':product.mainProductUnit,'price0exGST':product.mainProductPrice,
	// 			'avgcost':product.mainProductAvgCost,
	// 			'defaultPrice':null,'isMainProduct':true};
	// 			altProduct={
	// 			'itemCode':product.altProductObj.altProductCode,'itemDescription': product.altProductObj.altProductDesc,
	// 			'unit':product.altProductObj.altProductUnit,'price0exGST':product.altProductObj.altProductPrice0exGST,
	// 			'avgcost':product.altProductObj.altProductAvgCost,'defaultPrice':product.altProductObj.altProductDefaultPrice,
	// 			'isMainProduct':false
	// 			};
	// 			array.push(mainProduct);
	// 			array.push(altProduct);
	// 			mainProductAdded=true;
	// 		}else{
	// 			console.log("3...............")
	// 			altProduct={
	// 			'itemCode':listProd.altProductObj.altProductCode,'itemDescription': listProd.altProductObj.altProductDesc,
	// 			'unit':listProd.altProductObj.altProductUnit,'price0exGST':listProd.altProductObj.altProductPrice0exGST,
	// 			'avgcost':listProd.altProductObj.altProductAvgCost,'defaultPrice':listProd.altProductObj.altProductDefaultPrice,
	// 			'isMainProduct':false};
	// 			array.push(altProduct);
	// 		};
	// 	}
	// 	console.log(JSON.stringify(array))
	// });
	var altProduct={};
	var mainProduct={
				'itemCode':product.mainProductCode,'itemDescription': product.mainProductDesc,
				'unit':product.mainProductUnit,'price0exGST':product.mainProductPrice,
				'avgcost':product.mainProductAvgCost,
				'promoPrice':null,
				'isMainProduct':true};
	array.push(mainProduct);
    angular.forEach($scope.alternateProductListView, function(listProd, key){
    		if (listProd.mainProductCode==product.mainProductCode) {
    			// console.log(listProd);
    			altProduct={
				'itemCode':listProd.altProductObj.altProductCode,'itemDescription': listProd.altProductObj.altProductDesc,
				'unit':listProd.altProductObj.altProductUnit,'price0exGST':listProd.altProductObj.altProductPrice0exGST,
				'avgcost':listProd.altProductObj.altProductAvgCost,
				// 'defaultPrice':listProd.altProductObj.altProductDefaultPrice,
				'promoPrice':listProd.altProductObj.altPromoPrice,
				'isMainProduct':false};
				array.push(altProduct);
    		}
    });

    // console.log(array)
	return array;
};

$scope.editAlternateProductBtnClicked=function(index,product){
console.log("editMainAlternateProductInList");
// console.log(product);
$scope.editAlternativeObject={};
$scope.addAlternateProductBtnShow=false;
$scope.isAlternateProductTableView=false;
$scope.showAddEditView=true;
$scope.buttonstatus='edit';
$scope.showSpinner();
$scope.initAuotoComplete();
$scope.alternateProductList=[];
// $scope.createEditAlternativeArray($scope.editAlternativeObject);
if (product) {
$scope.alternateProductList=$scope.createEditAlternativeArray(product);
// console.log($scope.alternateProductList)
};
};
$scope.editAlternateProducts=function(){
	console.log("editAlternateProducts")
	$rootScope.showSpinner();
	SQManageMenuServices.UpdateAlternateProducts(JSON.stringify($scope.jsonToSaveAlternateProducts()))
}
$scope.handleUpdateAlternativeProductDoneResponse=function(data){
	$scope.productDetails={};
	if(data){
		if (data.code) {
			if(data.code.toUpperCase()=='SUCCESS'){
				swal({
					title: "Success",
					text: "Successfully updated alternative product!",
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
var cleanupEventUpdateAlternativeProductDone = $scope.$on("UpdateAlternativeProductDone", function(event, message){
	$scope.handleUpdateAlternativeProductDoneResponse(message);      
});

var cleanupEventUpdateAlternativeProductNotDone = $scope.$on("UpdateAlternativeProductNotDone", function(event, message){
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