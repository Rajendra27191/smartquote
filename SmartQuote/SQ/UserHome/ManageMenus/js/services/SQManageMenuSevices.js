    angular.module('sq.SmartQuoteDesktop')
    .factory('SQManageMenuServices', [
      '$rootScope',
      '$resource',
      '$http',
      '$state',
      '$log',
      function ($rootScope, $resource, $http, $state, $log) {
        var ManageServices = {
          getAlternateProductsView:$resource('/smartquote/getAlternateProductsView', {}, {getAlternateProductsViewMethod :{method: 'POST'}}),
          deleteAlternateProduct:$resource('/smartquote/deleteAlternateProduct?mainProductId=:mainProductId&altProductId=:altProductId', {}, {deleteAlternateProductMethod :{method: 'GET'},params:{mainProductId:'@mainProductId',altProductId:'@altProductId'}}),
        };
        var alternative = {};
        var data;
        var config = {
          headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
        }
        
    //================ Manage Alternate Product=======================
    alternative.CreateAlternateProducts = function (alternateProductDetails){
      console.log("CreateAlternateProducts")
      console.log(alternateProductDetails)
      data = $.param({alternateProductDetails:alternateProductDetails}); 
      $http.post('/smartquote/createAlternateProducts', data, config)
      .success(function (data, status, headers, config) {
        console.log(data);
        if (data.code=="sessionTimeOut") {
          $rootScope.$broadcast('SessionTimeOut', data);   
        }else{
          $rootScope.$broadcast('CreateAlternativeProductDone', data); 
        }
      })
      .error(function (data, status, header, config) {
        console.log(data);
        $rootScope.$broadcast('CreateAlternativeProductNotDone', data); 
      });
    }; 
    alternative.UpdateAlternateProducts = function (alternateProductDetails){
      console.log("CreateAlternateProducts")
      console.log(alternateProductDetails)
      data = $.param({alternateProductDetails:alternateProductDetails}); 
      $http.post('/smartquote/updateAlternateProducts', data, config)
      .success(function (data, status, headers, config) {
        console.log(data);
        if (data.code=="sessionTimeOut") {
          $rootScope.$broadcast('SessionTimeOut', data);   
        }else{
          $rootScope.$broadcast('UpdateAlternativeProductDone', data); 
        }
      })
      .error(function (data, status, header, config) {
        console.log(data);
        $rootScope.$broadcast('UpdateAlternativeProductNotDone', data); 
      });
    };

    alternative.GetAlternateProductsView = function (){
      console.log("GetAlternateProductsView")
      ManageServices.getAlternateProductsView.getAlternateProductsViewMethod(function(success){
        console.log(success);
        if (success.code=="sessionTimeOut") {
          $rootScope.$broadcast('SessionTimeOut', success);   
        }else{
          $rootScope.$broadcast('GetAlternateProductsViewDone', success); 
        }
      },function(error){
        console.log(error);
        $rootScope.$broadcast('GetAlternateProductsViewNotDone', error); 
      });
    };

    alternative.DeleteAlternateProduct = function (mainId,altId){
      ManageServices.deleteAlternateProduct.deleteAlternateProductMethod({mainProductId:mainId,altProductId:altId},function (success) {
        if (success.code=="sessionTimeOut") {
          $rootScope.$broadcast('SessionTimeOut', success);   
        }else{
          $rootScope.$broadcast('DeleteAlternateProductDone', success); 
        }
      }, function (error) {
        console.log(error);
        $rootScope.$broadcast('DeleteAlternateProductNotDone', error);  
      });
    }

    return alternative;
  }]);
