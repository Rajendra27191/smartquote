angular.module('sq.SmartQuoteDesktop')
.controller('SQUploadProductFileController',['$scope','$rootScope','$log','$state','$timeout','$http','SQHomeServices','$upload',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,$upload){
console.log('initialise SQUploadProductFileController');
var latestExcelFile;
$scope.errorMessage=[];
$scope.upload={};
$scope.onExcelSelect = function($files)  {
console.log("onExcelSelect");
  console.log($files);
     for (var i = 0; i < $files.length; i++) {
      if(($files[i].name.split('.').pop() == 'xlsx')){
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
  var productFile=latestExcelFile;
  var uploadUrl=$rootScope.projectName+"/uploadProductByXlsx";
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
      $scope.upload={};
    }else if(data.code=="sessionTimeOut"){
      $rootScope.$broadcast('SessionTimeOut', data); 
    }else{
      console.log(data); 
      $rootScope.alertError(data.message);                             
      document.getElementById('fileTypeExcelHost').value = '';
      latestExcelFile = {};
      $scope.upload={};
    }
    $rootScope.hideSpinner();
  })
  .error(function(data, status, header, config){
    $rootScope.alertServerError("Server error");
    $rootScope.hideSpinner();
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
      $scope.upload={};
    }else if(data.code=="sessionTimeOut"){
      $rootScope.$broadcast('SessionTimeOut', data); 
    }else{
      console.log(data); 
      $rootScope.alertError(data.message);                             
      document.getElementById('fileTypeExcelHost').value = '';
      latestExcelFile = {};
      $scope.upload={};
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
      document.getElementById('fileTypeExcelHost').value = '';
      latestExcelFile = {};
      $scope.upload={};
    }else if(data.code=="sessionTimeOut"){
      $rootScope.$broadcast('SessionTimeOut', data); 
    }else{
      console.log(data); 
      $rootScope.alertError(data.message);                             
      document.getElementById('fileTypeExcelHost').value = '';
      latestExcelFile = {};
      $scope.upload={};
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
      if ((latestExcelFile.size / 1024) < 15360) {//6144
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
          $rootScope.alertError("File size must ne less than 15MB"); 
      }    
      

     

    }
};

}]);

