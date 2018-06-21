angular.module('sq.SmartQuoteDesktop')
.controller('SQAutoSaveQuoteConroller',function($uibModal,$scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQManageMenuServices,hotkeys,$http,SQQuoteServices,CalculationFactory,ArrayOperationFactory){
console.log('initialise SQAutoSaveQuoteConroller');

$scope.form={};
$scope.customerQuote={};
$scope.isCustomerSelected=false;
$scope.isCustomerInvalid=false;
var isSupplierExist=false;
$scope.competeQuote=["Yes","No"];
$scope.customerQuote={'competeQuote':"No"};
$scope.currentSupplierList=[];
$scope.isProposalGenerated=false;
$scope.proposal={
    'id':'',
    'date':''
};

$scope.isCollapsed = true;
$scope.collapseDiv=function(){
$scope.isCollapsed = !$scope.isCollapsed;
};
// $scope.customerQuote.productList=[];
// $scope.addedProductList=[]; 
// $scope.addProduct={};
// $scope.isProductSelected=false;
// $scope.isAddProductModalShow=false;
// $rootScope.addedProductCount=0;
// $scope.productList=[];
// $scope.isAlternateAdded=false;
// $scope.customerQuote.saveWithAlternative=false;


if ($rootScope.userData) {
  if ($rootScope.userData.userType.toLowerCase()=="admin") {
    $scope.disableSalesPersonSelect=false;
  }else{
    $scope.disableSalesPersonSelect=true;
  }
};
//======= Scroll >>>>>
$(window).scroll(function() {
    if ($(document).scrollTop() > 70) {
    $('.moveTop').show();
    } else {
    $('.moveTop').hide();
    }
    });
    $scope.moveToCustomerInfo=function(){
    $window.scrollTo(0,0);
    $("#customerCode").focus();	
    }
//======= Scroll <<<<<
//======= Date Control >>>>>
$scope.today = function() {
    $scope.dt = new Date();
    // console.log($scope.dt)
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
// ======= Customer Panel Code >>>>>
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
$scope.customerCodeChanged=function(code){
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
    $scope.customerQuote.attn='';
    $scope.customerQuote.customerCode=code;
    $scope.filepreview='';
    }else{
    $scope.getCustomerDetails(customerCode);
    }
    // console.log("$scope.isNewCustomer  "+$scope.isNewCustomer)
    };

$scope.checkIfSupplierExist=function(){
isSupplierExist=false;
var supplier={}
angular.forEach($scope.currentSupplierList, function(currentSupplier, key){
if ($scope.customerQuote.currentSupplierName!=undefined&&$scope.customerQuote.currentSupplierName!=''&&$scope.customerQuote.currentSupplierName!=null) {    
if ($scope.customerQuote.currentSupplierName.key) {
}else{
if ($scope.customerQuote.currentSupplierName.toUpperCase()==currentSupplier.value.toUpperCase()){
isSupplierExist=true;
console.log(currentSupplier);
supplier.key = currentSupplier.key;
supplier.value = currentSupplier.value.toUpperCase();
supplier.code = currentSupplier.value.toUpperCase();
$scope.customerQuote.currentSupplierName = supplier;
}   
}
}       
});
if (isSupplierExist) {
$scope.form.addCustomerQuote.currentSupplierName.$invalid=true;
$('#currentSupplierName').focus();
}else{
$scope.form.addCustomerQuote.currentSupplierName.$invalid=false;
}
};
    /*===================GET CUSTOMER DETAILS=================*/
    $scope.assignCustomerDetails=function(data){
    var address='';
    address=data.address1;
    console.log("asssigning data to customer")
    $scope.customerQuote.customerCode=data.customerCode;
    $scope.customerQuote.customerName=data.customerName;
    $scope.customerQuote.attn=data.contactPerson;
    $scope.customerQuote.address=data.address;
    $scope.customerQuote.phone=data.phone;
    $scope.customerQuote.email=data.email;
    $scope.customerQuote.fax=data.fax;
    $scope.filepreview=data.customerLogoSrc;
    };
    
    $scope.getCustomerDetails=function(customer){
    // console.log(customer);
    $rootScope.showSpinner();
    SQManageMenuServices.GetCustomerDetails(customer.code);
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
    // ======= Customer Panel Code >>>>>    
//===================File Upload====================  
$scope.dynamicPopover = {
    templateUrl: 'myPopoverTemplate.html',
    title: 'Customer Logo'
    };
    
    $scope.filepreview="";
    var latestFile=null;
    var logoFile=null;
    $scope.onFileSelect = function($files){
    console.log("onFileSelect");
    console.log($files);
    console.log($files.length);
    if ($files.length>0) {
         for (var i = 0; i < $files.length; i++) {
             var fileType = $files[i].name.split('.').pop().toLowerCase();  
          if((fileType == 'jpg'|| fileType == 'jpeg' ||fileType == 'gif' || fileType == 'png')){
           console.log("valid file");
           latestFile = $files[i];
           $scope.file=latestFile
              if ((latestFile.size / 1024) <=100) {//6144
              $scope.invalidFileSize=false;		      	
              logoFile=latestFile;
              $scope.isFileNull=false;
              }else{
                console.log("invalid file size");
                $scope.invalidFileSize=true;
              }
          }else{
           console.log("invalid file");
           $scope.isInvalid=true;
           $scope.invalidFile=true;
           $scope.isFileNull=true;
           latestFile = null;
           logoFile=null;
           document.getElementById('fileTypeExcelHost').value = '';
           }
       }
    }else{	
        $scope.isFileNull=true;
        latestFile = null;
        logoFile=null;
    };
    };
    
    $scope.viewCustomerLogo=function(filepreview){
    console.log("viewCustomerLogo");
     $('#custLogoModal').modal({ keyboard: false,backdrop: 'static',show: true});
    console.log("");
    $scope.custLogoSrc=filepreview;
    };
    
    
    $scope.shouldShow = function (user) {
    // put your authorization logic here
    return user.code !== 1 && user.value !== 'admin';
    }







// ===== INIT() CreateQuote >>>>>>
function setUserAsSalesPerson () {
	angular.forEach($rootScope.userList, function(element, key){
	if (element.key==$rootScope.userData.userId && element.value==$rootScope.userData.userName) {
        if(element.key !== 1 && element.value !== 'admin'){
            $scope.customerQuote.salesPerson=element;
        }
    }    
	});
}
$scope.initCreateQuote=function(status){
console.log("initCreateQuote");
$rootScope.getUpdatedUserData();
if (status.toLowerCase()=='init1') {
console.log("init1");
// $scope.getProductGroup();//get product group list for add product
$scope.currentSupplierList=angular.copy($rootScope.supplierList);	
$scope.termConditionArray=angular.copy($rootScope.termConditionList);
$scope.serviceArray=angular.copy($rootScope.serviceList);
$scope.offerArray=angular.copy($rootScope.offerList);
setUserAsSalesPerson();//
$scope.initDate();
} else{
console.log("init2");
$scope.currentSupplierList=angular.copy($rootScope.supplierList);
$scope.termConditionArray=angular.copy($rootScope.termConditionList);
$scope.serviceArray=angular.copy($rootScope.serviceList);
$scope.offerArray=angular.copy($rootScope.offerList);
setUserAsSalesPerson();//
$scope.initDate();
};
// $rootScope.hideSpinner();	
};
$scope.initCreateQuote('init1');
// ======= INIT() CreateQuote <<<<<<


// ======= GenrateQuote >>>>>>
$scope.showGenerateConfirmationWindow=function(){
var previousWindowKeyDown = window.onkeydown;
swal({
title: 'Are you sure?',
text: "After generating proposal.User would not be able to edit Customer Information",
showCancelButton: true,
closeOnConfirm: true,
cancelButtonText:"Cancel",
confirmButtonText:"Confirm"
}, function (isConfirm) {
if (isConfirm) {
//$scope.resetCurrentSupplier();
 $rootScope.hideSpinner();
 SQQuoteServices.GenerateProposal(logoFile,$scope.jsonToGenerateQuote());
}else{
$scope.customerQuote.competeQuote='Yes';    
} 
});
};

$scope.jsonToGenerateQuote=function(){
var objQuoteBean={};
supplierName='';
supplierId=null;
var salesPerson='';
var salesPersonId=null;
if ($scope.customerQuote.currentSupplierName!=undefined) {
if($scope.customerQuote.currentSupplierName.key){
supplierName=$scope.customerQuote.currentSupplierName.value;
supplierId=$scope.customerQuote.currentSupplierName.key
}else{
if ($scope.customerQuote.currentSupplierName!="") {
supplierName=$scope.customerQuote.currentSupplierName;
supplierId=0;
}else{
supplierName=$scope.customerQuote.currentSupplierName;
supplierId=-1;  
};  
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
'competeQuote':$scope.customerQuote.competeQuote,
'salesPerson':salesPerson,
'salesPersonId':salesPersonId,
'pricesGstInclude':$scope.customerQuote.pricesGstInclude,
'notes':$scope.customerQuote.notes,
'userId':$rootScope.userData.userId,
}
return angular.toJson(objQuoteBean);;
};
$scope.resetCustomerInfo=function(){
    $scope.customerQuote={};
    $scope.customerQuote={'competeQuote':"No"};
    $scope.customerQuote.createdDate=$scope.today();
    $scope.form.addCustomerQuote.submitted=false;
    $scope.form.addCustomerQuote.$setPristine();
    setUserAsSalesPerson ();
};
$scope.generateProposal=function(){
    console.log($scope.form);
    console.log($scope.customerQuote)
    if ($scope.form.addCustomerQuote.$valid) {
        console.log("valid customer info");
        $scope.showGenerateConfirmationWindow();
    }else{
        console.log("invalid customer info");
        $scope.form.addCustomerQuote.submitted=true;
    }
};

//CREATE QUOTE RESPONSE >>>>>
function checkQuoteResponse(quoteResponse){
console.log("checkQuoteResponse" +quoteResponse);
if (quoteResponse) {
if (quoteResponse.newCustomerCreated) {
var obj={"code":$scope.customerQuote.customerCode,"key":quoteResponse.genratedCustomerId,"value":$scope.customerQuote.customerCode+" ("+$scope.customerQuote.customerName+")"};
ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.customerList,obj);
} 
if (quoteResponse.newSupplierCreated) {
var obj={"code":supplierName,"key":quoteResponse.genratedSupplierId,"value":supplierName};
ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.supplierList,obj);
} 
// if (quoteResponse.newProductCreated) {
//     $rootScope.initAuotoComplete(true);
//     $timeout(function() {
//     $scope.moveToCustomerInfo();
//     }, 2000);
// };
};
};

var createQuoteResponse={};
$scope.handleGenerateProposalDoneResponse=function(data){
createQuoteResponse={}; 
if(data){
if (data.code) {
if(data.code.toUpperCase()=='SUCCESS'){
console.log("Proposal Response ::")
console.log(angular.toJson(data));
createQuoteResponse=data;
checkQuoteResponse(createQuoteResponse);
$scope.proposal.id=data.genratedProposalId;

$scope.isProposalGenerated=true;

var previousWindowKeyDown = window.onkeydown;   
swal({
        title: "Success",
        text: "Successfully created proposal with id '"+$scope.proposal.id+"'",
        type: "success",
        timer: 2000,
        showConfirmButton: false       
    });
}else{
$rootScope.alertError(data.message);
$rootScope.hideSpinner();
}
}}
};
var cleanupEventQuoteSessionTimeOut = $scope.$on("QuoteSessionTimeOut", function(event, message){
$scope.resetCreateQuote();
$rootScope.$broadcast('SessionTimeOut', message);       
$rootScope.alertSessionTimeOutOnQuote();
});

var cleanupEventGenerateProposalDone = $scope.$on("GenerateProposalDone", function(event, message){
$scope.handleGenerateProposalDoneResponse(message);      
});

var cleanupEventGenerateProposalNotDone = $scope.$on("GenerateProposalNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});





$scope.$on('$destroy', function(event, message) {
    // cleanupEventCreateQuoteDone();
    // cleanupEventCreateQuoteNotDone();
    // cleanupEventQuoteSessionTimeOut();
    cleanupEventGetCustomerDetailsDone();
    cleanupEventGetCustomerDetailsNotDone();
    // cleanupEventGetProductGroupListDone();
    // cleanupEventGetProductGroupListNotDone();
    $rootScope.isQuoteActivated=false;
    });
});

