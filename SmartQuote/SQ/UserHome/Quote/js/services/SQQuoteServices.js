angular.module('sq.SmartQuoteDesktop')
.factory('SQQuoteServices', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
       // console.log($rootScope.projectName);
    var QuoteServices = {
      getCurrentSupplierList:$resource($rootScope.projectName+'/getCurrentSupplierList', {}, {getCurrentSupplierListMethod :{method: 'POST'}}),
      getSalesPersonList:$resource($rootScope.projectName+'/getSalesPersonList', {}, {getSalesPersonListMethod :{method: 'POST'}}),
      getQuoteView:$resource($rootScope.projectName+'/getQuoteView', {}, {getQuoteViewMethod :{method: 'POST'}}),
      getTermsAndServiceList:$resource($rootScope.projectName+'/getTermsAndServiceList?quoteId=:quoteId', {}, {getTermsAndServiceListMethod :{method: 'GET'},params:{quoteId:'@quoteId'}}),
      getProductDetailsWithAlternativesAPI:$resource($rootScope.projectName+'/getProductDetailsWithAlternatives?productCode=:productCode', {}, {getProductDetailsWithAlternativesMethod :{method: 'GET'},params:{productCode:'@productCode'}}),
      getProductDetailsAPI:$resource($rootScope.projectName+'/getProductDetails?productCode=:productCode', {}, {getProductDetailsMethod :{method: 'GET'},params:{productCode:'@productCode'}}),
     
      // getSalesPersonList:$resource('/deleteAlternateProduct?mainProductId=:mainProductId&altProductId=:altProductId', {}, {deleteAlternateProductMethod :{method: 'GET'},params:{mainProductId:'@mainProductId',altProductId:'@altProductId'}}),

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

quote.CreateQuote = function (logoFile,objQuoteBean){
  console.log("CreateQuote1")
  console.log(logoFile)
  // console.log(objQuoteBean)
  // data = $.param({objQuoteBean:objQuoteBean}); 
  var fd= new FormData();
  if(logoFile!=null){
  fd.append('logoFile',logoFile);
  }
  fd.append('objQuoteBean',objQuoteBean);
  // // $http.post($rootScope.projectName+'/createQuote', fd, config)
   $http.post($rootScope.projectName+'/createQuote', fd,{
    withCredentials: true,
    headers: {'Content-Type': undefined },
    transformRequest: angular.identity
  })
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
quote.changeQuoteStatus = function (objQuoteBean){
  console.log("changeQuoteStatus");
  console.log(objQuoteBean)
  data = $.param({objQuoteBean:objQuoteBean}); 
  $http.post($rootScope.projectName+'/changeQuoteStatus', data, config)
  .success(function (data, status, headers, config) {
    console.log(data);
    if (data.code=="sessionTimeOut") {
      $rootScope.$broadcast('QuoteSessionTimeOut', data);     
    }else{
      $rootScope.$broadcast('ChangeQuoteStatusDone', data); 
    }
  })
  .error(function (data, status, header, config) {
    console.log(data);
    $rootScope.$broadcast('ChangeQuoteStatusNotDone', data);
  });
};

quote.GetQuoteView = function (){
// console.log("GetQuoteView")
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
  $http.post($rootScope.projectName+'/updateQuote', data, config)
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
  url: $rootScope.projectName+"/addComment?quoteId="+quoteId+"&comment="+comment,
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

quote.GetProductDetailsWithAlternatives = function (productCode){
console.log(productCode)
QuoteServices.getProductDetailsWithAlternativesAPI.getProductDetailsWithAlternativesMethod({"productCode":productCode},function(success){
console.log(success);
$rootScope.$broadcast('GetProductDetailsWithAlternativesDone', success); 
},function(error){
console.log(error);
$rootScope.$broadcast('GetProductDetailsWithAlternativesNotDone', error);
});
};

quote.GetAltProductDetails = function (productCode){
console.log(productCode)
QuoteServices.getProductDetailsAPI.getProductDetailsMethod({"productCode":productCode},function(success){
console.log(success);
$rootScope.$broadcast('GetAltProductDetailsDone', success); 
},function(error){
console.log(error);
$rootScope.$broadcast('GetAltProductDetailsNotDone', error);
});
};




return quote;
}])

// quote.GetStandardCalculations = function (){
// console.log("GetStandardCalculations")
// quote={'key1':"val1"}
// };org.apache.struts2.views.jasperreports.ValueStackDataSource
.factory('CalculationFactory', function(){
    // var objectInfo={'subtotal':0,'gstTotal':0,'total':0};
    return {
        sayHello: function(text){
            return "Factory says \"Hello " + text + "\"";
        },
        getSupplierInformation: function(quote){
            // console.log("getSupplierInformation");
            var subtotal=0;
            var gstTotal=0;
            var customerQuote=angular.copy(quote);
            var supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
            if (customerQuote.productList.length>0) {
            angular.forEach(customerQuote.productList, function(value, key){
            subtotal=subtotal+parseFloat(value.currentSupplierTotal); 
            console.log(value)
            if (value.gstFlag) {
            if (value.gstFlag.toUpperCase()=='NO') {
            gstTotal=gstTotal+((10/100)*value.currentSupplierTotal)
            } 
            };
            });

            if (customerQuote.pricesGstInclude) {  
            supplierInformation.subtotal=subtotal-gstTotal;
            supplierInformation.gstTotal=gstTotal;
            supplierInformation.total=supplierInformation.subtotal+supplierInformation.gstTotal;
            }else{
            supplierInformation.subtotal=subtotal;
            supplierInformation.gstTotal=gstTotal;
            supplierInformation.total=supplierInformation.subtotal+supplierInformation.gstTotal;
            }
            }else{
            supplierInformation={'subtotal':0,'gstTotal':0,'total':0};
            }
            return supplierInformation;
        },
        getGpInformation: function(quote){
          var gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
          var customerQuote=angular.copy(quote);
          var gpRequiredSubtotal=0;
          var currentSupplierGPSubtotal=0;
          var countGpRequired=0;
          var countcurrentSupplierGP=0;
          if (customerQuote.productList.length>0) {
            angular.forEach(customerQuote.productList, function(value, key){
              gpRequiredSubtotal=gpRequiredSubtotal+parseFloat(value.gpRequired);
              countGpRequired++;
            });
            angular.forEach(customerQuote.productList, function(value, key){
              currentSupplierGPSubtotal=currentSupplierGPSubtotal+parseFloat(value.currentSupplierGP);
              countcurrentSupplierGP++;
            });
          
            gpInformation.avgGpRequired=gpRequiredSubtotal/countGpRequired;
            gpInformation.avgCurrentSupplierGp=currentSupplierGPSubtotal/countcurrentSupplierGP;
          }else{
            gpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};  
          }

          return gpInformation;
        }, 
        getTotalInformation: function(quote){
            var subtotal=0;
            var gstTotal=0;
            var customerQuote=angular.copy(quote);
            var totalInformation={'subtotal':0,'gstTotal':0,'total':0};
            if (customerQuote.productList.length>0) {
              angular.forEach(customerQuote.productList, function(value, key){
                subtotal=subtotal+parseFloat(value.total);
                if (value.gstFlag) {
                if (value.gstFlag.toUpperCase()=='NO') {
                  gstTotal=gstTotal+((10/100)*parseFloat(value.total))
                }
                };
              });
                if (customerQuote.pricesGstInclude) {
                totalInformation.subtotal=subtotal-gstTotal;
                totalInformation.gstTotal=gstTotal;
                totalInformation.total=totalInformation.subtotal+totalInformation.gstTotal;
                }else{
                totalInformation.subtotal=subtotal;
                totalInformation.gstTotal=gstTotal;
                totalInformation.total=totalInformation.subtotal+totalInformation.gstTotal;
                }
            }else{
              totalInformation={'subtotal':0,'gstTotal':0,'total':0};
            }
          
          return totalInformation;
        }, 
        
        getAltSupplierInformation: function(quote){
        var altSupplierInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
        var customerQuote=angular.copy(quote);
        var subtotal=0;
        var gstTotal=0;
        if (customerQuote.productList.length>0) {
        angular.forEach(customerQuote.productList, function(value, key){
          if (value.isLinkedExact) {
            if (value.altProd.currentSupplierTotal) { 
            subtotal=subtotal+parseFloat(value.altProd.currentSupplierTotal);   
            }
            if (value.altProd.currentSupplierTotal && value.altProd.gstFlag.toUpperCase()=='NO') { 
            gstTotal=gstTotal+((10/100)*parseFloat(value.altProd.currentSupplierTotal))   
            }

          }else{
            subtotal=subtotal+parseFloat(value.currentSupplierTotal);
            if (value.gstFlag) {
            if (value.gstFlag.toUpperCase()=='NO') {
            gstTotal=gstTotal+((10/100)*parseFloat(value.currentSupplierTotal))
            }
            }
          }
        });
          if (customerQuote.pricesGstInclude) {  
            altSupplierInformation.subtotal=subtotal-gstTotal;
            altSupplierInformation.gstTotal=gstTotal;
            altSupplierInformation.total=altSupplierInformation.subtotal+altSupplierInformation.gstTotal;  
          }else{
            altSupplierInformation.subtotal=subtotal;
            altSupplierInformation.gstTotal=gstTotal;
            altSupplierInformation.total=altSupplierInformation.subtotal+altSupplierInformation.gstTotal;    
          }
       
        }else{
        altSupplierInformation={'subtotal':0,'gstTotal':0,'total':0};
        }
        return altSupplierInformation;
        }, 
        getAltGpInformation: function(quote){
          var altGpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0};
          var customerQuote=angular.copy(quote);
          var gpRequiredSubtotal=0;
          var currentSupplierGPSubtotal=0;
          var countGpRequired=0;
          var countcurrentSupplierGP=0;
          if (customerQuote.productList.length>0) {
            angular.forEach(customerQuote.productList, function(value, key){ 
              if (value.isLinkedExact) {
                if (value.altProd.gpRequired) {
                  gpRequiredSubtotal=gpRequiredSubtotal+parseFloat(value.altProd.gpRequired);
                  countGpRequired++;  
                }
              }else{
                gpRequiredSubtotal=gpRequiredSubtotal+parseFloat(value.gpRequired);
                countGpRequired++;
              }
            });
            angular.forEach(customerQuote.productList, function(value, key){
              if (value.isLinkedExact) {
                if (value.altProd.currentSupplierGP) {  
                  currentSupplierGPSubtotal=currentSupplierGPSubtotal+parseFloat(value.altProd.currentSupplierGP);
                  countcurrentSupplierGP++; 
                }
              }else{
                currentSupplierGPSubtotal=currentSupplierGPSubtotal+parseFloat(value.currentSupplierGP);
                countcurrentSupplierGP++;
              }
            });
            altGpInformation.avgGpRequired=gpRequiredSubtotal/countGpRequired;
            altGpInformation.avgCurrentSupplierGp=currentSupplierGPSubtotal/countcurrentSupplierGP;
          }else{
            altGpInformation={'avgGpRequired':0,'avgCurrentSupplierGp':0}; 
          }
          return altGpInformation;
        },
        getAltTotalInformation: function(quote){
          var altTotalInformation={'subtotal':0,'gstTotal':0,'total':0};
          var customerQuote=angular.copy(quote);
          var subtotal=0;
          var gstTotal=0;
          if (customerQuote.productList.length>0) {
            angular.forEach(customerQuote.productList, function(value, key){
              // console.log(value)
              if (value.isLinkedExact) {
                if (value.altProd.total) {  
                  subtotal=subtotal+parseFloat(value.altProd.total);    
                }
                //------
                if (value.altProd.total && value.altProd.gstFlag.toUpperCase()=='NO') {  
                    gstTotal=gstTotal+((10/100)*parseFloat(value.altProd.total))    
                }

              }else{
                subtotal=subtotal+parseFloat(value.total);
                //---
                if (value.gstFlag) {
                if (value.gstFlag.toUpperCase()=='NO') {
                    gstTotal=gstTotal+((10/100)*parseFloat(value.total))
                }
              }
              }
            });
              if (customerQuote.pricesGstInclude) {
                altTotalInformation.subtotal=subtotal-gstTotal;
                altTotalInformation.gstTotal=gstTotal;
                altTotalInformation.total=altTotalInformation.subtotal+altTotalInformation.gstTotal;
              }else{
                altTotalInformation.subtotal=subtotal;
                altTotalInformation.gstTotal=gstTotal;
                altTotalInformation.total=altTotalInformation.subtotal+altTotalInformation.gstTotal;
              }
            
          }else{
            altTotalInformation={'subtotal':0,'gstTotal':0,'total':0};
          }
          return altTotalInformation;
        },
    }               
});