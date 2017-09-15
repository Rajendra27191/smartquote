angular.module('sq.SmartQuoteDesktop')
.controller('SQUploadProductFileController',['$scope','$rootScope','$log','$state','$timeout','$http','SQHomeServices','SQUserHomeServices','$upload',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,SQUserHomeServices,$upload){
console.log('initialise SQUploadProductFileController');
var latestExcelFile;
$scope.errorMessage=[];
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

$scope.addExcelToServer = function(){
  //console.log($scope.ordertype)
    if(latestExcelFile === undefined || latestExcelFile === {} || document.getElementById('fileTypeExcelHost').value === '')
    {
      $scope.errorMessage=[];
      $scope.isRequired=true;
      $timeout(function() {
      $scope.isRequired=false;
      }, 3000);
    }else
    {   
      console.log(latestExcelFile.size);
      if ((latestExcelFile.size / 1024) < 15360) {//6144
        // console.log("valid size");
         console.log(latestExcelFile.size);
        var productFile=latestExcelFile;
        var uploadUrl="/smartquote/uploadProductByXlsx";
        var fd= new FormData();
        fd.append('productFile',productFile);

        $rootScope.showSpinner();
        //  $scope.upload=$upload.upload({
        //  url: uploadUrl,
        //  // file:fd,
        //   data: {"productFile": productFile,}
        // }).success(function(data){
        //   console.log("SUCCESS :")
        //   console.log(data)
        //   if(data.code.toUpperCase()=="SUCCESS"){
        //     // console.log(data);
        //     $rootScope.alertSuccess(data.message);
        //     document.getElementById('fileTypeExcelHost').value = '';
        //     latestExcelFile = {};
        //     }else if(data.code=="sessionTimeOut"){
        //     $rootScope.$broadcast('SessionTimeOut', data); 
        //     }else{
        //       console.log(data); 
        //       $rootScope.alertError(data.message);                             
        //       document.getElementById('fileTypeExcelHost').value = '';
        //       latestExcelFile = {};
        //     }
        //     $rootScope.hideSpinner();
        // }).error(function(data){
        //   console.log("ERROR :")
        //   console.log(data)
        //   $rootScope.alertServerError("Server error");
        //   $rootScope.hideSpinner();
        // })

        $http.post(uploadUrl, fd,{
          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
        })
        .success(function(data, status, header, config){
          // console.log(data);
          if(data.code.toUpperCase()=="SUCCESS"){
            // console.log(data);
            $rootScope.alertSuccess(data.message);
            document.getElementById('fileTypeExcelHost').value = '';
            latestExcelFile = {};
            }else if(data.code=="sessionTimeOut"){
            $rootScope.$broadcast('SessionTimeOut', data); 
            }else{
              console.log(data); 
              $rootScope.alertError(data.message);                             
              document.getElementById('fileTypeExcelHost').value = '';
              latestExcelFile = {};
            }
            $rootScope.hideSpinner();
        })
        .error(function(data, status, header, config){
        $rootScope.alertServerError("Server error");
        $rootScope.hideSpinner();
        });

      }else{
          $rootScope.alertError("File size must ne less than 15MB"); 
      }    
      

     

    }
};

}]);

