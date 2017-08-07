angular.module('sq.SmartQuoteDesktop')
.factory('SQQuoteServices', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
    var QuoteServices = {
      getCurrentSupplierList:$resource('/smartquote/getCurrentSupplierList', {}, {getCurrentSupplierListMethod :{method: 'POST'}}),
      getSalesPersonList:$resource('/smartquote/getSalesPersonList', {}, {getSalesPersonListMethod :{method: 'POST'}}),
      getQuoteView:$resource('/smartquote/getQuoteView', {}, {getQuoteViewMethod :{method: 'POST'}}),
      getTermsAndServiceList:$resource('/smartquote/getTermsAndServiceList?quoteId=:quoteId', {}, {getTermsAndServiceListMethod :{method: 'GET'},params:{quoteId:'@quoteId'}}),
     
      // getSalesPersonList:$resource('/smartquote/deleteAlternateProduct?mainProductId=:mainProductId&altProductId=:altProductId', {}, {deleteAlternateProductMethod :{method: 'GET'},params:{mainProductId:'@mainProductId',altProductId:'@altProductId'}}),

    };
    var quote = {};
    var data;
    var config = {
      headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
    }

// ==========================CREATE QUOTE ================================
quote.GetCurrentSupplierList = function (){
// console.log(objQuoteBean)
QuoteServices.getCurrentSupplierList.getCurrentSupplierListMethod(function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
  $rootScope.$broadcast('SessionTimeOut', success);   
}else{
  $rootScope.$broadcast('GetCurrentSupplierListDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetCurrentSupplierListNotDone', error);
});
};

quote.GetSalesPersonList = function (){
// console.log(objQuoteBean)
QuoteServices.getSalesPersonList.getSalesPersonListMethod(function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
  $rootScope.$broadcast('SessionTimeOut', success);   
}else{
  $rootScope.$broadcast('GetSalesPersonListDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetSalesPersonListNotDone', error);
});
};

quote.CreateQuote = function (objQuoteBean){
  console.log("CreateQuote1")
  data = $.param({objQuoteBean:objQuoteBean}); 
  $http.post('/smartquote/createQuote', data, config)
  .success(function (data, status, headers, config) {
    console.log(data);
    if (data.code=="sessionTimeOut") {
      $rootScope.$broadcast('QuoteSessionTimeOut', data);     
    }else{
      $rootScope.$broadcast('CreateQuoteDone', data); 
    }
  })
  .error(function (data, status, header, config) {
    console.log(data);
    $rootScope.$broadcast('CreateQuoteNotDone', data);
  });
};

// ==========================VIEW/EDIT QUOTE ================================

quote.GetQuoteView = function (){
console.log("GetQuoteView")
QuoteServices.getQuoteView.getQuoteViewMethod(function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
  $rootScope.$broadcast('SessionTimeOut', success);   
}else{
  $rootScope.$broadcast('GetQuoteViewDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetQuoteViewNotDone', error);
});
};

quote.GetTermsAndServiceList = function (quoteId){
console.log(quoteId)
QuoteServices.getTermsAndServiceList.getTermsAndServiceListMethod({"quoteId":quoteId},function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
  $rootScope.$broadcast('SessionTimeOut', success);   
}else{
  $rootScope.$broadcast('GetTermsAndServiceListDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetTermsAndServiceListNotDone', error);
});
};

quote.UpdateQuote = function (objQuoteBean){
  console.log("UpdateQuote1")
  data = $.param({objQuoteBean:objQuoteBean}); 
  $http.post('/smartquote/updateQuote', data, config)
  .success(function (data, status, headers, config) {
    console.log(data);
    if (data.code=="sessionTimeOut") {
      $rootScope.$broadcast('QuoteSessionTimeOut', data);     
    }else{
      $rootScope.$broadcast('UpdateQuoteDone', data); 
    }
  })
  .error(function (data, status, header, config) {
    console.log(data);
    $rootScope.$broadcast('UpdateQuoteNotDone', data);
  });

};

quote.AddComment = function (quoteId,comment){
// console.log(objQuoteBean)
$http({
  method: "POST",
  url: "/smartquote/addComment?quoteId="+quoteId+"&comment="+comment,
}).success(function(data, status, header, config){
// console.log(data);
if (data.code=="sessionTimeOut") {
  $('#commentModal').modal('hide');
  $rootScope.$broadcast('SessionTimeOut', data);   
}else{
  $rootScope.$broadcast('AddCommentDone', data); 
}
}).error(function(data, status, header, config){
// console.log(data);
$rootScope.$broadcast('AddCommentNotDone', data);
});
};


return quote;
}]);