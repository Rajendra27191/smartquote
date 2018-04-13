angular.module('sq.SmartQuoteDesktop')
.controller('SQManageCustomerController',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,SQManageMenuServices, DTOptionsBuilder, DTColumnDefBuilder,$upload,ArrayOperationFactory){
console.log('initialise SQManageCustomerController controller');
$scope.form={};
$scope.filepreview="";
$scope.manageCustomer={};
// $scope.link="https://farm4.staticflickr.com/3261/2801924702_ffbdeda927_d.jpg"
// $scope.buttonstatus='add';
$scope.address='';
$scope.isAddress=false;
$scope.isCollapsed = true;
$scope.customerList=[];
$scope.customerListView=[];
$scope.iscustomerCodeSelected=false;


$scope.collapseDiv=function(){
$scope.isCollapsed = !$scope.isCollapsed;
$scope.address="address1"
};

$scope.init=function(){
$rootScope.showSpinner();
SQManageMenuServices.GetCustomerListView();	
//$rootScope.showSpinner();
//SQManageMenuServices.GetCustomerList();
// $("#customerDataTable").dataTable({
//   	"order":[[2,"desc"]]
//   });
};

$scope.init();

$scope.reset=function(){
$scope.manageCustomer={};
$scope.buttonstatus='add';
$scope.isCollapsed = true;
$scope.address='';
};

$scope.resetForm=function(){
$scope.form.manageCustomer.submitted=false;
$scope.form.manageCustomer.$setPristine();
};
$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8) {
		$scope.reset();
		$scope.resetForm();
    }

};

$scope.customerCodeChanged=function(){
console.log("customerCodeChanged")
if ($scope.iscustomerCodeSelected) {
$scope.buttonstatus='add';
var tempcode=$scope.manageCustomer.customerCode;
$scope.reset();
$scope.resetForm();
$scope.manageCustomer.customerCode = tempcode;	
}
};

$scope.editing = [];
$scope.showDetails=function(customerListView,index){
// console.log(termConditionList);	
// console.log(index);
if ($scope.editing[index]==true) {
	 $scope.editing[index] = false;
}else{
	for(var i=0;i<customerListView.length;i++){
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
/*=============GET CUSTOMER LIST VIEW==================*/
$scope.handleGetCustomerListViewDoneResponse=function(data){
	console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.customerListView=angular.copy(data.objCustomersDetailResponseList);
  console.log($scope.customerListView);
  	// $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
	// $scope.dtOptions= DTOptionsBuilder.newOptions().withOption('order', [0, 'asc']);
	// $scope.dtColumnDefs = [
	//         DTColumnDefBuilder.newColumnDef(0),
	//         DTColumnDefBuilder.newColumnDef(1),
	//         DTColumnDefBuilder.newColumnDef(2),
	//         DTColumnDefBuilder.newColumnDef(3),
	//         DTColumnDefBuilder.newColumnDef(4),
	//         DTColumnDefBuilder.newColumnDef(5),
	//         DTColumnDefBuilder.newColumnDef(6),
	//         DTColumnDefBuilder.newColumnDef(7),
	//         DTColumnDefBuilder.newColumnDef(8),
	//         DTColumnDefBuilder.newColumnDef(9),
	// ];
   

}
$rootScope.hideSpinner();
}
}
};

var cleanupEventGetCustomerListViewDone = $scope.$on("GetCustomerListViewDone", function(event, message){
$scope.handleGetCustomerListViewDoneResponse(message);      
});

var cleanupEventGetCustomerListViewNotDone = $scope.$on("GetCustomerListViewNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*=============ADD CUSTOMER==================*/
$scope.initCustomer=function(){
$scope.isCustomerTableView=true;
$scope.addCustomerBtnShow=true;
$scope.isCustomerAddView=false;	
$scope.buttonstatus='add';
};

$scope.initCustomer();
$scope.addCustomerBtnClicked=function(){
	$scope.isCustomerTableView=false;
	$scope.addCustomerBtnShow=false;
	$scope.isCustomerAddView=true;
	$scope.filepreview="";
};

$scope.cancelAddCustomer=function(){
$scope.reset();
$scope.resetForm();
$scope.initCustomer();
};

function getTimeStamp(){
	var timestamp = new Date().getTime();
	return  timestamp;
}
$scope.editCustomerBtnClicked=function(customer){
	console.log(customer)
  	$scope.manageCustomer=angular.copy(customer);
  	$scope.buttonstatus='edit';
  	$scope.isCustomerTableView=false;
	$scope.addCustomerBtnShow=false;
	$scope.isCustomerAddView=true;
	$scope.filepreview=$scope.manageCustomer.customerLogoSrc+"?"+getTimeStamp();//+ DateTime.Now.ToString("ddMMyyyyhhmmsstt");
};

/*===============CUSTOMER LOGO==================*/
var latestFile;
$scope.errorMessage=[];
$scope.upload={};
$scope.file = {};
var logoFile;

$scope.onFileSelect = function($files){
console.log("onFileSelect");
console.log($files);
console.log($files.length);
// console.log($files.height);
if ($files.length>0) {
     for (var i = 0; i < $files.length; i++) {
      if(($files[i].name.split('.').pop() == 'jpg'||$files[i].name.split('.').pop() == 'jpeg' ||$files[i].name.split('.').pop() == 'gif' || $files[i].name.split('.').pop() == 'png')){
       console.log("valid file");
       latestFile = $files[i];
       $scope.file=latestFile
       console.log("File",latestFile.size+" bytes");
       console.log("File",(latestFile.size / 1024)+" kb");
       console.log("")
	      if ((latestFile.size / 1024) <=100) {//6144
		  $scope.invalidFileSize=false;		      	
	      logoFile=latestFile;
	      }else{
			console.log("invalid file size");
			$scope.invalidFileSize=true;
			// $rootScope.alertError("File size must ne less than 15KB"); 
	      }
      }else{
       console.log("invalid file");
       $scope.isInvalid=true;
       // $timeout(function() {
       // $scope.isInvalid=false;
       // }, 3000);
       // console.log('Please upload valid excel file.');
       $scope.invalidFile=true;
       latestFile = {};
       document.getElementById('fileTypeExcelHost').value = '';
       }
   }
}else{
	$scope.isFileNull=true;
};
 };
$scope.createCustomer = function(){
  var uploadUrl=$rootScope.projectName+"/createCustomer";
  var fd= new FormData();
  if(logoFile){
  console.log(logoFile)
  fd.append('logoFile',logoFile);
  }
  fd.append('customerDetails',$scope.jsonToSaveCustomer());
  $http.post(uploadUrl, fd,{
    withCredentials: true,
    headers: {'Content-Type': undefined },
    transformRequest: angular.identity
  })
  .success(function(data, status, header, config){
  		if (data.code=="sessionTimeOut") {
        $rootScope.$broadcast('SessionTimeOut', data);   
        }else{
        $rootScope.$broadcast('CreateCustomerDone', data); 
        }
  })
  .error(function(data, status, header, config){
  	 $rootScope.$broadcast('CreateCustomerNotDone', data);
   });
};
$scope.updateCustomer = function(){
  var uploadUrl=$rootScope.projectName+"/updateCustomerDetails";
  var fd= new FormData();
  if(logoFile){
  console.log(logoFile)
  fd.append('logoFile',logoFile);
  }
  fd.append('customerDetails',$scope.jsonToSaveCustomer());
  $http.post(uploadUrl, fd,{
    withCredentials: true,
    headers: {'Content-Type': undefined },
    transformRequest: angular.identity
  })
  .success(function(data, status, header, config){
    if (data.code=="sessionTimeOut") {
    $rootScope.$broadcast('SessionTimeOut', data);   
    }else{
    $rootScope.$broadcast('UpdateCustomerDone', data); 
    }
  }).error(function(data, status, header, config){
    $rootScope.$broadcast('UpdateCustomerNotDone', data);
  });
}
/*===============CREATE CUSTOMER==================*/
$scope.jsonToSaveCustomer=function(){
	var customer={
		"customerCode":$scope.manageCustomer.customerCode,
		"customerName":$scope.manageCustomer.customerName,
		"phone":$scope.manageCustomer.phone,
		"contactPerson":$scope.manageCustomer.contactPerson,
		"address1":$scope.manageCustomer.address1,
		"address2":$scope.manageCustomer.address2,
		"suburb":$scope.manageCustomer.suburb,
		"state":$scope.manageCustomer.state,
		"postalCode":$scope.manageCustomer.postalCode,
		"fax":$scope.manageCustomer.fax,
		"email":$scope.manageCustomer.email,
		"totalStaff":$scope.manageCustomer.totalStaff,
		"avgPurchase":$scope.manageCustomer.avgPurchase,
		"industryType":$scope.manageCustomer.industryType
	};
	if ($scope.buttonstatus=='edit') {
		customer.custId=$scope.manageCustomer.custId;
	};
return JSON.stringify(customer);
};
$scope.saveCustomer=function(){
if($scope.form.manageCustomer.$valid){
	console.log("valid");
	if ($scope.buttonstatus=='add'){
	var customerExist=false;
	$scope.customerList.forEach(function(element,index){
	 if(element.code.toLowerCase()==$scope.manageCustomer.customerCode.toLowerCase()){
	 	customerExist=true;
	 }	
	});	
	if (customerExist) {
	 	$rootScope.alertError("Customer code already exist");
	}else{
		$rootScope.showSpinner();
		// SQManageMenuServices.CreateCustomer($scope.jsonToSaveCustomer());
		console.log($scope.jsonToSaveCustomer());
		$scope.createCustomer();
	}	
	}else if($scope.buttonstatus=='edit'){
		$rootScope.showSpinner();
		console.log($scope.jsonToSaveCustomer());
		$scope.updateCustomer();
		// SQManageMenuServices.UpdateCustomer($scope.jsonToSaveCustomer());
	}
	// console.log($scope.jsonToSaveCustomer());	
}else{
	$scope.form.manageCustomer.submitted=true;
}
};

/*==================ADD CUSTOMER RESPONSE===================*/
var objToPush={};
$scope.handleCreateCustomerDoneResponse=function(data){
console.log("handleCreateCustomerDoneResponse")	
objToPush={};
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	console.log(data)
  	// $rootScope.alertSuccess("Successfully saved customer");
  	objToPush={"code":$scope.manageCustomer.customerCode,"key":data.genratedId,"value":$scope.manageCustomer.customerCode+" ("+$scope.manageCustomer.customerName+")"};
  	ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.customerList,objToPush);
  	swal({
	  title: "Success",
	  text: "Successfully saved customer!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	$scope.initCustomer();
	});

	}else{
		$rootScope.alertError(data.message);
		$scope.reset();
		$scope.resetForm();
	}
$rootScope.hideSpinner();
}
}
};

var cleanupEventCreateCustomerDone = $scope.$on("CreateCustomerDone", function(event, message){
$scope.handleCreateCustomerDoneResponse(message);      
});

var cleanupEventCreateCustomerNotDone = $scope.$on("CreateCustomerNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*==================UPDATE CUSTOMER RESPONSE===================*/
var objToUpdate={};
$scope.handleUpdateCustomerDoneResponse=function(data){
	objToUpdate={};
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	// $rootScope.alertSuccess("Successfully updated customer");
  	objToUpdate={"code":$scope.manageCustomer.customerCode,"key":$scope.manageCustomer.custId,"value":$scope.manageCustomer.customerCode+" ("+$scope.manageCustomer.customerName+")"};
  	ArrayOperationFactory.updateArrayKeyValue($rootScope.customerList,objToUpdate);

	swal({
	  title: "Success",
	  text: "Successfully updated customer!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	$scope.initCustomer();
	});
	}else{
		$rootScope.alertError(data.message);
	}
$rootScope.hideSpinner();
}
}
};

var cleanupEventUpdateCustomerDone = $scope.$on("UpdateCustomerDone", function(event, message){
$scope.handleUpdateCustomerDoneResponse(message);      
});

var cleanupEventUpdateCustomerNotDone = $scope.$on("UpdateCustomerNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*==================DELETE CUSTOMER RESPONSE===================*/

var objToDelete={};
$scope.deleteCustomer=function(customer){
var customerCode=customer.customerCode;
//console.log(customerCode);
objToDelete={}
if (customerCode!==''&&customerCode!==undefined&&customerCode!==null) {
	var previousWindowKeyDown = window.onkeydown;
	swal({
	title: 'Are you sure?',
	text: "You will not be able to recover this customer!",
	showCancelButton: true,
	closeOnConfirm: false,
	}, function (isConfirm) {
	window.onkeydown = previousWindowKeyDown;
	if (isConfirm) {
	 $rootScope.showSpinner();
	 SQManageMenuServices.DeleteCustomer(customerCode);
	 objToDelete={"code":customer.customerCode,"key":customer.custId,"value":customer.customerCode+" ("+customer.customerName+")"};
  	
	} 
	});
}
};
$scope.handleDeleteCustomerDoneResponse=function(data){
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  	ArrayOperationFactory.deleteFromArrayKeyValue($rootScope.customerList,objToDelete);
  	var previousWindowKeyDown = window.onkeydown;
	swal({
	title: 'Success',
	text: "Successfully deleted customer!",
	type:"success"
	}, function (isConfirm) {
	window.onkeydown = previousWindowKeyDown;
	if (isConfirm) {
  	$scope.reset();
	$scope.init();
	$scope.initCustomer();
	} 
	});
  	// $rootScope.alertSuccess("Successfully deleted customer");
	//$scope.resetForm();
	}else{
		$rootScope.alertError(data.message);
	}
$rootScope.hideSpinner();
}
}
};

var cleanupEventDeleteCustomerDone = $scope.$on("DeleteCustomerDone", function(event, message){
$scope.handleDeleteCustomerDoneResponse(message);      
});

var cleanupEventDeleteCustomerNotDone = $scope.$on("DeleteCustomerNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

$scope.$on('$destroy', function(event, message) {
	cleanupEventGetCustomerListViewDone();
	cleanupEventGetCustomerListViewNotDone();
	cleanupEventCreateCustomerDone();
	cleanupEventCreateCustomerNotDone();
	cleanupEventUpdateCustomerDone();
	cleanupEventUpdateCustomerNotDone();
	cleanupEventDeleteCustomerDone();
	cleanupEventDeleteCustomerNotDone();

});

})

