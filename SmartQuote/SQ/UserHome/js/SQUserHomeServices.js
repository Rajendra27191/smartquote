angular.module('sq.SmartQuoteDesktop')
.factory('SQUserHomeServices', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
    var UserHomeServices = {
      //delete
        getTermsListAPI:$resource('/smartquote/getTermsConditions', {}, {getTermsListMethod :{method: 'POST'}}),
        createTermsConditionsAPI:$resource('/smartquote/createTermsConditions?termCondition=:termCondition', {}, {createTermsConditionsMethod :{method: 'GET'},params:{termCondition:'@termCondition'}}),
        updateTermsConditionsAPI:$resource('/smartquote/updateTermsConditions?termCondition=:termCondition&id=:id', {}, {updateTermsConditionsMethod :{method: 'GET'},params:{termCondition:'@termCondition',id:'@id'}}),
        deleteTermConditionAPI:$resource('/smartquote/deleteTermCondition?id=:id', {}, {deleteTermConditionMethod :{method: 'GET'},params:{id:'@id'}}),
        getServicesAPI:$resource('/smartquote/getServices', {}, {getServicesMethod :{method: 'POST'}}),
        createServiceAPI:$resource('/smartquote/createService?service=:service', {}, {createServiceMethod :{method: 'GET'},params:{service:'@service'}}),
        updateServiceAPI:$resource('/smartquote/updateService?service=:service&id=:id', {}, {updateServiceMethod :{method: 'GET'},params:{service:'@service',id:'@id'}}),
        deleteServiceAPI:$resource('/smartquote/deleteService?id=:id', {}, {deleteServiceMethod :{method: 'GET'},params:{id:'@id'}}),
      //delete
      
        getProductsFromJsonFile:$resource('/smartquote/products.json', {}, {getProductsFromJsonFileMethod:{method:'GET'}})
      };
    var userhome = {};
    var data;
    var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

    userhome.GetProductsFromJsonFile = function (){
    $http.get('/smartquote/products.json')
    .success(function(data) {
    console.log(data)
    $rootScope.$broadcast('GetProductsFromJsonFileDone', data);
    })
    .error(function (data, status, header, config) {
    console.log(data);
    $rootScope.$broadcast('GetProductsFromJsonFileNotDone', data);
    });
    };        





    return userhome;
  }
]);

