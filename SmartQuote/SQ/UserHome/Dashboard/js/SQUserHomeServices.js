angular.module('sq.SmartQuoteDesktop')
.factory('SQUserHomeServices', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
    var UserHomeServices = {
        getProductsFromJsonFile:$resource($rootScope.projectName+'/products.json', {}, {getProductsFromJsonFileMethod:{method:'GET'}}),
        // getChartDataApi:$resource($rootScope.projectName+'/getChartData', {}, {getChartDataMethod:{method:'GET'}}),
        getChartDataApi:$resource($rootScope.projectName+'/getChartData',{}, {getChartDataMethod :{method: 'POST'}})

      };
    var userhome = {};
    var data;
    var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

    userhome.GetProductsFromJsonFile = function (){
    $http.get($rootScope.projectName+'/products.json')
    .success(function(data) {
    console.log(data)
    $rootScope.$broadcast('GetProductsFromJsonFileDone', data);
    })
    .error(function (data, status, header, config) {
    console.log(data);
    $rootScope.$broadcast('GetProductsFromJsonFileNotDone', data);
    });
    };        

    // userhome.GetChartData = function (){
    // UserHomeServices.getChartDataApi.getChartDataMethod(function (success) {
    // console.log(success)
    // if (success.code=="sessionTimeOut") {
    // $rootScope.$broadcast('SessionTimeOut', success);   
    // }else{
    // $rootScope.$broadcast('GetChartDataDone', success); 
    // }
    // }, function (error) {
    // console.log(error);
    // $rootScope.$broadcast('GetChartDataNotDone', error);  
    // });
    // };     

    userhome.GetChartData = function (data){
    console.log(data)
    data = $.param({chartDetails:data}); 
    $http.post($rootScope.projectName+'/getChartData', data, config)
    .success(function (data, status, headers, config) {
    console.log(data);
    if (data.code=="sessionTimeOut") {
      $rootScope.$broadcast('QuoteSessionTimeOut', data);     
    }else{
       $rootScope.$broadcast('GetChartDataDone', data); 
    }
    })
    .error(function (data, status, header, config) {
    console.log(data);
    $rootScope.$broadcast('GetChartDataNotDone', data);  
    });
    };     





    return userhome;
  }
]);

