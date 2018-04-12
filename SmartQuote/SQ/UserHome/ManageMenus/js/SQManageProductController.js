angular.module('sq.SmartQuoteDesktop')
.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
})
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    }
})
.controller('SQManageProductController',['$window','$scope','$rootScope','$log','$state','$timeout','SQHomeServices','SQManageMenuServices','filterFilter',function($window,$scope,$rootScope,$log,$state,$timeout,SQHomeServices,SQManageMenuServices,filterFilter){
console.log('initialise SQManageProductController controller');
$window.pageYOffset;

$scope.form={};
$scope.manageProduct={};
// $scope.buttonstatus='add';
$scope.productList=[];
$scope.isProductSelected=false;
$scope.productGroupList=[];
$scope.disabledNext=false;

// $scope.init=function(prodLike){
// // $rootScope.showSpinner();
// // SQManageMenuServices.GetProductList(prodLike);
// $rootScope.showSpinner();
// SQManageMenuServices.GetProductGroupList();

// };
// $scope.init("");
// =================////////////////////=========================


// =================////////////////////=========================
$scope.reset=function(){
$scope.manageProduct={};
$scope.buttonstatus='add';
$scope.productList=[];
};

$scope.resetForm=function(){
$scope.form.manageProduct.submitted=false;
$scope.form.manageProduct.$setPristine();
};

$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8 || event.key==='Backspace') {
		$scope.reset();
		$scope.resetForm();
    }else{
    	if($scope.manageProduct.itemCode) {	
    	if ($scope.manageProduct.itemCode.length==1) {
    	var prodLike=$scope.manageProduct.itemCode;
    	// $scope.init(prodLike);
    	  }
    	}
    }
};
$scope.itemCodeChanged=function(event){
console.log("itemCodeChanged");
console.log(event);
};

$scope.productListView=[];
$scope.countProducts=0;
var from=0;
var to=1000;
$scope.fromLimit=from;
$scope.toLimit=1000;

$scope.init=function(from,to,reInit){
$rootScope.showSpinner();
SQManageMenuServices.GetProductListView(from,to);
$scope.reinit=reInit;
};

$scope.init(from,to,false);

$scope.getPreviousProducts=function(){
 console.log("getPreviousProducts");
 $scope.disabledNext=false;
 $scope.countProducts--;
 console.log("$scope.countProducts :"+$scope.countProducts);
 if($scope.countProducts>=0){
  from=from-1000;
  to=1000;
 // from=from-100;
 // to=to-100;

 $rootScope.showSpinner();
 SQManageMenuServices.GetProductListView(from,to);
 $timeout(function() {
 $scope.toLimit=$scope.toLimit-1000;
 $scope.fromLimit=from;
 }, 3000);
 // console.log("From :"+from)
 // console.log("To :"+to)
}
}
$scope.getNextProducts=function(){
 console.log("getNextProducts");
 $scope.countProducts++;
 console.log("$scope.countProducts :"+$scope.countProducts);
 if($scope.countProducts>0){
 from=from+1000;
 to=1000;
 
 $rootScope.showSpinner();
 SQManageMenuServices.GetProductListView(from,to);
 $timeout(function() {
 $scope.toLimit=$scope.toLimit+1000;
 $scope.fromLimit=from;
 }, 3000);
 // console.log("From :"+from)
 // console.log("To :"+to)
}
}

$scope.entries=[10,25,50,100];
$scope.itemsPerPage=10;
$scope.currentPage=1;
$scope.page={};
$scope.page.search='';
$scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
}

$scope.$watch('productListView', function (newVal, oldVal) {
console.log("productListView $watch")	
$scope.pageChange(1,$scope.itemsPerPage)
}, true);
$scope.$watch('page.search', function (newVal, oldVal) {
	console.log("page search")
if (newVal=='') {
	$scope.searchingEnabled=false;
	console.log("$scope.searchingEnabled : "+$scope.searchingEnabled)
}else{
	$scope.searchingEnabled=true;
	console.log("$scope.searchingEnabled : "+$scope.searchingEnabled);
	// $scope.showingTo=newPageNumber*itemsPerPage;
 //    $scope.showingFrom=$scope.showingTo-(itemsPerPage-1) 
}
}, true);

$scope.pageChange = function(newPageNumber,itemsPerPage){
console.log("On page change")
$scope.showingTo=newPageNumber*itemsPerPage;
$scope.showingFrom=$scope.showingTo-(itemsPerPage-1)
}
$scope.rowsChange = function(length,currentPage,itemsPerPage){
// console.log("On rows change")
// console.log(length,currentPage,itemsPerPage);
$scope.pageEnd=false;
$scope.selectedRows=length;
if ((currentPage*itemsPerPage)>length) {
// console.log(currentPage*itemsPerPage-(currentPage*itemsPerPage-length))
$scope.pageEnd=true;
$scope.toPageEnd=currentPage*itemsPerPage-(currentPage*itemsPerPage-length);
}
	// (currentPage*itemsPerPage)-((currentPage*itemsPerPage)-((productListView | filter:page.search).length))
}


// $scope.noMatchingRecordsFound=false
// angular.element('body').on('search.dt', function() {  
// var searchTerm = document.querySelector('.dataTables_filter input').value;
// console.log('dataTables search : ' + searchTerm); 
// $scope.search=searchTerm;
// });

// 	if($.fn.DataTable.settings.length > 0){
// 	$.fn.DataTable.settings[0].oLanguage['sZeroRecords'] = "errorMessage1" ;
// 	}else{
// 	 $.extend(true, $.fn.dataTable.defaults, {
// 	    oLanguage: {'sZeroRecords': "Product not available in current list.<a href='#' id='searchProductInOtherList' class='parent'><b>Click here</b> {{norecord=true}} </a> to search in other list"}
// 	});
// 	// console.log("vvvvvvvvv")
// 	// $scope.noMatchingRecordsFound=true; 
// 	}

/*=============Search in otherlist==================*/
$scope.searchProductInOtherList=function(search){
console.log("searchProductInOtherList");
console.log(search);
var prodLike=search;
$rootScope.showSpinner();
SQManageMenuServices.GetSearchedProductListView(prodLike);

};
// /*=============GET PRODUCT  LIST==================*/
$scope.handleGetSearchedProductListViewDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	$scope.searchedProductList=[];
  	$scope.searchedProductList=data.objProductDetailResponseList;
	$scope.entries=[10,25,50,100];
	$scope.itemsPerPage=10;
	// $scope.page={};
	// $scope.page.search='';
	// console.log($scope.productListView.length);
	if($scope.searchedProductList.length==0){
	$rootScope.alertError("No such product available");
	$scope.page={};
	$scope.page.search='';
	}else{	
	console.log($scope.searchedProductList);
	angular.forEach($scope.searchedProductList, function(value, key){
	$scope.productListView.push(value);
  });
	}
   console.log($scope.productListView.length);
}
}
}
$rootScope.hideSpinner();
};

var cleanupEventGetSearchedProductListViewDone = $scope.$on("GetSearchedProductListViewDone", function(event, message){
console.log("GetSearchedProductListViewDone...");
console.log(message);
$scope.handleGetSearchedProductListViewDoneResponse(message);      
});

var cleanupEventGetSearchedProductListViewNotDone = $scope.$on("GetSearchedProductListViewNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*=============GetProductListView==================*/

$scope.handleGetProductListViewDoneResponse=function(data){
if(data){
  if(data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
  console.log(data);
  $scope.productListView=[];
  $scope.productListView=angular.copy(data.objProductDetailResponseList);
  $scope.page={};
  $scope.page.search='';
  if ($scope.productListView.length>0) {
  }else{
  	if ($scope.countProducts>0){
  		$scope.disabledNext=true;
  		from=from-1000;
  		$scope.init(from,to);
  		$scope.fromLimit=from;
        $scope.toLimit=$scope.toLimit-1000;

  	}
  }
  $rootScope.showSpinner();
  SQManageMenuServices.GetProductGroupList();
  }
  }
}

// $rootScope.hideSpinner();
};

var cleanupEventGetProductListViewDone = $scope.$on("GetProductListViewDone", function(event, message){
console.log("GetProductListViewDone");
console.log(message);
$scope.handleGetProductListViewDoneResponse(message);      
});

var cleanupEventGetProductListViewNotDone = $scope.$on("GetProductListViewNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*=============ADD PRODUCT==================*/
$scope.initProduct=function(){
$scope.isProductTableView=true;
$scope.addProductBtnShow=true;
$scope.isProductAddView=false;	
$scope.buttonstatus='add';
};
$scope.initProduct();
$scope.addProductBtnClicked=function(){
	$rootScope.moveToTop();
	$scope.isProductTableView=false;
	$scope.addProductBtnShow=false;
	$scope.isProductAddView=true;
	$scope.manageProduct.gstFlag="NO";
};

$scope.cancelAddProduct=function(){
$rootScope.moveToTop();
$scope.initProduct();
$scope.reset();
$scope.resetForm();
};

$scope.editProductBtnClicked=function(product){
	console.log(product)
  	$scope.buttonstatus='edit';
  	$scope.manageProduct=angular.copy(product);
  	var productGroupCode=product.productGroupCode;
	// console.log($scope.productGroupList)
	$scope.productGroupList.forEach(function(element,index){
		if (product.productGroupCode){
		if (product.productGroupCode.code) {
			if(element.code==product.productGroupCode){
			console.log(element)
			productGroupCode=element;
			}	
		}else{
			if(element.code==product.productGroupCode){
			console.log(",,,,,,,,,,,,,,");
			console.log(element)
			productGroupCode=element;
			}
			// productGroupCode=element;
			// $scope.form.manageProduct.submitted=true;
			// $scope.form.manageProduct.productGroupCode.$valid=false;
		}
	 }	
	});
	$scope.manageProduct.productGroupCode=productGroupCode;
	console.log($scope.manageProduct)
  	$scope.isProductTableView=false;
	$scope.addProductBtnShow=false;
	$scope.isProductAddView=true;
  	
};

/*=============GET PRODUCT GROUP LIST==================*/
$scope.handleGetGetProductGroupListDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
  $scope.productGroupList=data.result;
}
// $rootScope.hideSpinner();
}
}
if ($scope.reinit) {
	$rootScope.initAuotoComplete(true);
}else{
$rootScope.hideSpinner();	
}
};

var cleanupEventGetProductGroupListDone = $scope.$on("GetProductGroupListDone", function(event, message){
$scope.handleGetGetProductGroupListDoneResponse(message);      
});

var cleanupEventGetProductGroupListNotDone = $scope.$on("GetProductGroupListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});


/*===============SAVE PRODUCT====================*/
$scope.jsonToSaveProduct=function(){
	var productGroupCode;
	if ($scope.manageProduct.productGroupCode) {
		if ($scope.manageProduct.productGroupCode.code) {
			productGroupCode=$scope.manageProduct.productGroupCode.code;
		}else{
			productGroupCode=$scope.manageProduct.productGroupCode;
		}
	}
	var product={
		"itemCode":$scope.manageProduct.itemCode,
		"productGroupCode":productGroupCode,
		"itemDescription":$scope.manageProduct.itemDescription,
		"description2":$scope.manageProduct.description2,
		"description3":$scope.manageProduct.description3,
		"unit":$scope.manageProduct.unit,
		"qtyBreak0":$scope.manageProduct.qtyBreak0,
		"price0exGST":$scope.manageProduct.price0exGST,
		"qtyBreak1":$scope.manageProduct.qtyBreak1,
		"price1exGST":$scope.manageProduct.price1exGST,
		"qtyBreak2":$scope.manageProduct.qtyBreak2,
		"price2exGST":$scope.manageProduct.price2exGST,
		"qtyBreak3":$scope.manageProduct.qtyBreak3,
		"price3exGST":$scope.manageProduct.price3exGST,
		"qtyBreak4":$scope.manageProduct.qtyBreak4,
		"price4exGST":$scope.manageProduct.price4exGST,
		"avgcost":$scope.manageProduct.avgcost,
		"taxCode":$scope.manageProduct.taxCode,
		"gstFlag":$scope.manageProduct.gstFlag,
		"promoPrice":$scope.manageProduct.promoPrice,
	};
return JSON.stringify(product);
};

$scope.saveProductDetails=function(){
	if($scope.form.manageProduct.$valid){
	console.log("valid");
	console.log($scope.jsonToSaveProduct());
	if ($scope.buttonstatus=='add'){
	var productExist=false;
	
	$scope.productList.forEach(function(element,index){
	 if(element.code.toLowerCase()==$scope.manageProduct.itemCode.toLowerCase()){
	 	productExist=true;
	 }	
	});	
	if (productExist) {
	 	$rootScope.alertError("Item code already exist");
	}else{
		$rootScope.showSpinner();
		SQManageMenuServices.CreateProduct($scope.jsonToSaveProduct());
	}	
	}else if($scope.buttonstatus=='edit'){
		$rootScope.showSpinner();
		// console.log($scope.jsonToSaveProduct())
		SQManageMenuServices.UpdateProductDetails($scope.jsonToSaveProduct());
	}
}else{
	$rootScope.moveToTop();
	$scope.form.manageProduct.submitted=true;
}
};

// /*==================ADD PRODUCT GROUP RESPONSE===================*/
$scope.handleCreateProductDoneResponse=function(data){
if(data){
if(data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data);
  	//$rootScope.alertSuccess("Successfully saved product");
  	swal({
	  title: "Success",
	  text: "Successfully saved product!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.reset();
	$scope.resetForm();
	$scope.init(from,to,true);
	$scope.initProduct();
	// $rootScope.initAuotoComplete(true);
	});
   	//$scope.init();
	}else{
	$rootScope.alertError(data.message);
	$rootScope.hideSpinner();
	}
}
}
};

var cleanupEventCreateProductDone = $scope.$on("CreateProductDone", function(event, message){
$scope.handleCreateProductDoneResponse(message);      
});

var cleanupEventCreateProductNotDone = $scope.$on("CreateProductNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// /*==================UPDATE PRODUCT GROUP RESPONSE===================*/
$scope.handleUpdateProductDetailsDoneResponse=function(data){
if(data){
if(data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
	swal({
	  title: "Success",
	  text: "Successfully updated product!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.reset();
	$scope.resetForm();
	$scope.init(from,to,true);
	$scope.initProduct();
	// $rootScope.initAuotoComplete(true);
	});
	//$scope.init();
	}else{
		$rootScope.alertError(data.message);
		$rootScope.hideSpinner();
	}
}
}
};

var cleanupEventUpdateProductDetailsDone = $scope.$on("UpdateProductDetailsDone", function(event, message){
$scope.handleUpdateProductDetailsDoneResponse(message);      
});

var cleanupEventUpdateProductDetailsNotDone = $scope.$on("UpdateProductDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// /*==================DELETE CUSTOMER RESPONSE===================*/
$scope.deleteFromProductListView=function(product){
console.log("deleteFromProductListView")	
// console.log(index);
console.log(product);
console.log($scope.productListView.length);
objIndex = $scope.productListView.findIndex((obj => obj.itemCode == product.itemCode));
$scope.productListView.splice(objIndex,1);
console.log($scope.productListView.length);
$timeout(function() {
$rootScope.hideSpinner();
}, 3000);
};

var deleteProductObj={};
$scope.deleteProduct=function(product,index){
// console.log("$scope.productListView.length"+$scope.productListView.length);
deleteProductObj={};
var productCode=product.itemCode;
if (productCode!==''&&productCode!==undefined&&productCode!==null) {
var previousWindowKeyDown = window.onkeydown;
swal({
title: 'Are you sure?',
text: "You will not be able to recover this product!",
showCancelButton: true,
closeOnConfirm: true,
}, function (isConfirm) {
window.onkeydown = previousWindowKeyDown;
if (isConfirm) {
	// $scope.deleteFromProductListView(product);
$rootScope.showSpinner();
SQManageMenuServices.DeleteProduct(productCode);
deleteProductObj=product;
} 
});
}
};



$scope.handleDeleteProductDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
	var previousWindowKeyDown = window.onkeydown;
	swal({
	title: 'Success',
	text: "Successfully deleted product!",
	type:"success"
	}, function (isConfirm) {
	window.onkeydown = previousWindowKeyDown;
	if (isConfirm) {
	// $scope.init();
	$scope.initProduct();
	$scope.deleteFromProductListView(deleteProductObj);
	$rootScope.initAuotoComplete(true);
	// $scope.deleteFromProductListView($scope.deleteProductIndex);
	} 
	});
	}else{
		$rootScope.alertError(data.message);
		$rootScope.hideSpinner();
	}
}
}
};

var cleanupEventDeleteProductDone = $scope.$on("DeleteProductDone", function(event, message){
$scope.handleDeleteProductDoneResponse(message);      
});

var cleanupEventDeleteProductNotDone = $scope.$on("DeleteProductNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*==========================EXTRAAAAAA=============================================================================*/


// /*===================GET PRODUCT GROUP DETAILS=================*/

// $scope.getProductDetails=function(product){
// //console.log(product);
// $rootScope.showSpinner();
// SQManageMenuServices.GetProductDetails(product.code);
// };

// $scope.handleGetProductDetailsDoneResponse=function(data){
// if(data){
// if (data.code) {
//   if(data.code.toUpperCase()=='SUCCESS'){
//   	console.log(data)
//   	$scope.manageProduct=data.objProductResponseBean;
//   	$scope.isProductSelected=true;
//   	$scope.buttonstatus='edit';
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



$scope.$on('$destroy', function(event, message) {
	// cleanupEventGetProductListDone();
	// cleanupEventGetProductListNotDone();
	// cleanupEventGetProductDetailsDone();
	// cleanupEventGetProductDetailsNotDone();
	cleanupEventCreateProductDone();
	cleanupEventCreateProductNotDone();
	cleanupEventUpdateProductDetailsDone();
	cleanupEventUpdateProductDetailsNotDone();
	cleanupEventDeleteProductDone();
	cleanupEventDeleteProductNotDone();
});
}]);