angular.module('sq.SmartQuoteDesktop')
.controller('SQUploadProductFileController', function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,$upload,$interval,SQManageMenuServices){
console.log('initialise SQUploadProductFileController');
var latestExcelFile;
$scope.errorMessage=[];
$scope.upload={};
$scope.upload.type='products';
$scope.records = [
        "",
        "",
        "",
        "",
        "",
    ]

$scope.onExcelSelect = function($files)  {
console.log("onExcelSelect");
  console.log($files);
  var type="";
  if ($scope.upload.type=='products') {
    type = 'csv';
  }else{
    type = 'xlsx';
  };
  console.log(type)
     for (var i = 0; i < $files.length; i++) {
      // if(($files[i].name.split('.').pop() == 'xlsx')){
      if(($files[i].name.split('.').pop() == type)){
       console.log("valid file");
       latestExcelFile = $files[i];
      }
      else{
       console.log("invalid file");
       $scope.isValid=true;
       $timeout(function() {
       $scope.isValid=false;
            }, 3000);
        console.log('Please upload valid excel file.');
       $scope.invalidFile=true;
       latestExcelFile = {};
       document.getElementById('fileTypeExcelHost').value = '';
       }
      }
};

$scope.uploadProductsFile = function(){
  $scope.totalFileCount=0;
  $scope.currentFileCount=0;
  var productFile=latestExcelFile;
  // var uploadUrl=$rootScope.projectName+"/uploadProductByXlsx";
  var uploadUrl=$rootScope.projectName+"/uploadProductByCsv";
  var fd= new FormData();
  fd.append('productFile',productFile);
  $rootScope.showSpinner();
  $timeout(function() {
  $scope.showProgressBar=true;
  },1000);
  $http.post(uploadUrl, fd,{
    withCredentials: true,
    headers: {'Content-Type': undefined },
    transformRequest: angular.identity
  })
  .success(function(data, status, header, config){
    if(data.code.toUpperCase()=="SUCCESS"){
     
      $scope.progressCount=100;
      
      $timeout(function() {
        $rootScope.alertSuccess(data.message);
        document.getElementById('fileTypeExcelHost').value = '';
        latestExcelFile = {};
        // $scope.upload={};
        $scope.showProgressBar=false;
        $scope.progressCount=0;
        $scope.currentProgressCount=0;
        $rootScope.initAuotoComplete(true);      
      },2000);
     
    }else if(data.code=="sessionTimeOut"){
      $rootScope.$broadcast('SessionTimeOut', data); 
    }else{
      console.log(data); 
       $rootScope.alertError(data.message);   
      latestExcelFile = {};
      // $scope.upload={};
      $scope.showProgressBar=false;
      $scope.progressCount=0;
      $scope.currentProgressCount=0; 
      document.getElementById('fileTypeExcelHost').value = '';      
    }
    $rootScope.hideSpinner();
    

  })
  .error(function(data, status, header, config){
    $rootScope.alertServerError("Server error");
    $rootScope.hideSpinner();
    $scope.showProgressBar=false;
  });
};
$scope.uploadProductsWithPromoPrice = function(){
  var productFile=latestExcelFile;
  var uploadUrl=$rootScope.projectName+"/uploadProductPromoPriceByXlsx";
  var fd= new FormData();
  fd.append('productFile',productFile);
  $rootScope.showSpinner();
  $http.post(uploadUrl, fd,{
    withCredentials: true,
    headers: {'Content-Type': undefined },
    transformRequest: angular.identity
  })
  .success(function(data, status, header, config){
    if(data.code.toUpperCase()=="SUCCESS"){
      $rootScope.alertSuccess(data.message);
      document.getElementById('fileTypeExcelHost').value = '';
      latestExcelFile = {};
      // $scope.upload={};
    }else if(data.code=="sessionTimeOut"){
      $rootScope.$broadcast('SessionTimeOut', data); 
    }else{
      console.log(data); 
      $rootScope.alertError(data.message);                             
      document.getElementById('fileTypeExcelHost').value = '';
      latestExcelFile = {};
      // $scope.upload={};
    }
    $rootScope.hideSpinner();
  })
  .error(function(data, status, header, config){
    $rootScope.alertServerError("Server error");
    $rootScope.hideSpinner();
  });
};
$scope.uploadNewProductCode = function(){
var productFile=latestExcelFile;
  var uploadUrl=$rootScope.projectName+"/uploadNewProductCodeByXlsx";
  var fd= new FormData();
  fd.append('productFile',productFile);
  $rootScope.showSpinner();
  $http.post(uploadUrl, fd,{
    withCredentials: true,
    headers: {'Content-Type': undefined },
    transformRequest: angular.identity
  })
  .success(function(data, status, header, config){
    if(data.code.toUpperCase()=="SUCCESS"){
      $rootScope.alertSuccess(data.message);
      $rootScope.initAuotoComplete(true);
      document.getElementById('fileTypeExcelHost').value = '';
      latestExcelFile = {};
      // $scope.upload={};
    }else if(data.code=="sessionTimeOut"){
      $rootScope.$broadcast('SessionTimeOut', data); 
    }else{
      console.log(data); 
      $rootScope.alertError(data.message);                             
      document.getElementById('fileTypeExcelHost').value = '';
      latestExcelFile = {};
      // $scope.upload={};
    }
    $rootScope.hideSpinner();
  })
  .error(function(data, status, header, config){
    $rootScope.alertServerError("Server error");
    $rootScope.hideSpinner();
  });


};
$scope.addExcelToServer = function(){
  //console.log($scope.ordertype)
    if(latestExcelFile === undefined || latestExcelFile === {} || document.getElementById('fileTypeExcelHost').value === '')
    {
      $scope.errorMessage=[];
      $scope.isRequired=true;
      $timeout(function() {
      $scope.isRequired=false;
      }, 3000);
    }else {   
      console.log(latestExcelFile.size);
      if ((latestExcelFile.size / 1024) < 50720) {//6144 //15360
      console.log(latestExcelFile.size);
      console.log($scope.upload);
        if ($scope.upload!=''&&$scope.upload!=undefined&&$scope.upload!=null) {
          if ($scope.upload.type) {
            console.log("1...............");
            if ($scope.upload.type=='products') {
            console.log("2...............");
            $scope.uploadProductsFile();
            }else if ($scope.upload.type=='promoPrice') {
            console.log("3...............");
            $scope.uploadProductsWithPromoPrice();
            }else if ($scope.upload.type=='newProductCode') {
            console.log("4...............");
            $scope.uploadNewProductCode();
            };
          }else{
            // console.log("2...............")
            // $rootScope.alertError("Please select uploading type"); 
            $rootScope.SQNotify("Please select uploading type",'error'); 
          }
        }
      }else{
          $rootScope.alertError("File size must ne less than 50MB"); 
      }    
      

     

    }
};

//============================================================
$scope.progressCount=0;
$scope.currentProgressCount=0;
$scope.checkUploadProgress=function(){
  if ($scope.showProgressBar) {
  SQManageMenuServices.GetProductUploadProgress();
  };
};

$scope.handleGetProductUploadProgressDoneResponse=function(data){
if(data){
$scope.totalFileCount=data.totalFileCount;
$scope.currentFileCount=data.currentFileCount;
if ($scope.currentFileCount!=0 && $scope.totalFileCount!=0) {
 $scope.currentProgressCount= ($scope.currentFileCount/$scope.totalFileCount)*100;
 $scope.progressCount=$scope.currentProgressCount.toFixed(2);
}else{
  $scope.progressCount=0;
};
}
};

var cleanupEventGetProductUploadProgressDone = $scope.$on("GetProductUploadProgressDone", function(event, message){
$scope.handleGetProductUploadProgressDoneResponse(message);      
});

var cleanupEventGetProductUploadProgressNotDone = $scope.$on("GetProductUploadProgressNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

$scope.radius=100;
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
// $interval($scope.checkUploadProgress, 5000);

// $scope.count=0;
// $scope.checkProgress=function(){
//   if ($scope.count==100) {
//   } else{
//   $scope.count++;
//   };
// }

// $interval($scope.checkProgress, 1000);






});

