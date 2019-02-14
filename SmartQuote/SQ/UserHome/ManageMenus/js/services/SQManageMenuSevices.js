angular.module('sq.SmartQuoteDesktop')
.factory('SQManageMenuServices', [
'$rootScope',
'$resource',
'$http',
'$state',
'$log',
function ($rootScope, $resource, $http, $state, $log) {
// console.log($rootScope.projectName)
var ManageServices = {
	
//UserGroup API	
setUserGroupAPI:$resource($rootScope.projectName+'/getAssignedAccess?userGroupId=:userGroupId', {}, {setUserGroupMethod :{method: 'GET'},params:{userGroupId:'@userGroupId'}}),
getProductUploadProgressAPI:$resource($rootScope.projectName+'/getProductUploadProgress', {}, {getProductUploadProgressMethod :{method: 'POST'}}),
//Services API	
getServicesAPI:$resource($rootScope.projectName+'/getServices', {}, {getServicesMethod :{method: 'POST'}}),
createServiceAPI:$resource($rootScope.projectName+'/createService?service=:service', {}, {createServiceMethod :{method: 'GET'},params:{service:'@service'}}),
updateServiceAPI:$resource($rootScope.projectName+'/updateService?service=:service&id=:id', {}, {updateServiceMethod :{method: 'GET'},params:{service:'@service',id:'@id'}}),
deleteServiceAPI:$resource($rootScope.projectName+'/deleteService?id=:id', {}, {deleteServiceMethod :{method: 'GET'},params:{id:'@id'}}),

//Term Condition API	
getTermsListAPI:$resource($rootScope.projectName+'/getTermsConditions', {}, {getTermsListMethod :{method: 'POST'}}),
createTermsConditionsAPI:$resource($rootScope.projectName+'/createTermsConditions?termCondition=:termCondition', {}, {createTermsConditionsMethod :{method: 'GET'},params:{termCondition:'@termCondition'}}),
updateTermsConditionsAPI:$resource($rootScope.projectName+'/updateTermsConditions?termCondition=:termCondition&id=:id', {}, {updateTermsConditionsMethod :{method: 'GET'},params:{termCondition:'@termCondition',id:'@id'}}),
deleteTermConditionAPI:$resource($rootScope.projectName+'/deleteTermCondition?id=:id', {}, {deleteTermConditionMethod :{method: 'GET'},params:{id:'@id'}}),

//Alternative API	
getAlternateProductsView:$resource($rootScope.projectName+'/getAlternateProductsView', {}, {getAlternateProductsViewMethod :{method: 'POST'}}),
deleteAlternateProduct:$resource($rootScope.projectName+'/deleteAlternateProduct?mainProductId=:mainProductId&altProductId=:altProductId', {}, {deleteAlternateProductMethod :{method: 'GET'},params:{mainProductId:'@mainProductId',altProductId:'@altProductId'}}),
getOffersList:$resource($rootScope.projectName+'/getOffersList', {}, {getOffersListMethod :{method: 'POST'}}),
deleteOffer:$resource($rootScope.projectName+'/deleteOffer?id=:id', {}, {deleteOfferMethod :{method: 'GET'},params:{id:'@id'}}),
};
var manageMenu = {};
var data;
var config = {
headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
}

/*===============Manage User Group====================*/
manageMenu.setUserGroup = function (userGroupId){
ManageServices.setUserGroupAPI.setUserGroupMethod({userGroupId:userGroupId},function (success) {
console.log(success)
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{          
$rootScope.$broadcast('SetUserGroupDone', success);    
}     
}, function (error) {
console.log(error);
$rootScope.$broadcast('SetUserGroupNotDone', error);  
});
};

manageMenu.saveUserGroup = function (userGroupName,checkedMenuList){
$http({
method: "POST",
url: $rootScope.projectName+"/createUserGroup?userGroupName="+userGroupName+"&checkedMenuList="+checkedMenuList,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('AddUserGroupDone', data); 
}   
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('AddUserGroupNotDone', data); 
});
};

manageMenu.editUserGroup = function (userGroupId,checkedMenuList){
$http({
method: "POST",
url: $rootScope.projectName+"/updateUserGroup?userGroupId="+userGroupId+"&checkedMenuList="+checkedMenuList,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('EditUserGroupDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('EditUserGroupNotDone', data);
});
};

manageMenu.deleteUserGroup = function (userGroupId){
$http({
method: "POST",
url: $rootScope.projectName+"/deleteUserGroup?userGroupId="+userGroupId,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteUserGroupDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteUserGroupNotDone', data);
});
};
/*===================Manage User Starts====================*/
manageMenu.SaveUser = function (userDetails){
console.log(userDetails)
$http({
method: "POST",
url: $rootScope.projectName+"/createUser?userDetails="+userDetails,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('SaveUserDone', data); 
}
}).error(function(data, status, header, config){
console.log(data);
$rootScope.$broadcast('SaveUserNotDone', data);
});
}; 

manageMenu.GetUserList = function (){
$http({
method: "POST",
url: $rootScope.projectName+"/getUserList",
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetUserListDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetUserListNotDone', data);
});
};

manageMenu.GetUserDetails = function (userId){
console.log(userId)
$http({
method: "POST",
url: $rootScope.projectName+"/getUserDetails?userId="+userId,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetUserDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetUserDetailsNotDone', data);
});
};

manageMenu.UpdateUserDetails = function (userDetails){
$http({
method: "POST",
url: $rootScope.projectName+"/updateUserDetails?userDetails="+userDetails,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateUserDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('UpdateUserDetailsNotDone', data);
});
};

manageMenu.DeleteUser = function (userId){
$http({
method: "POST",
url: $rootScope.projectName+"/deleteUser?userId="+userId,
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteUserDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteUserNotDone', data);
});
};
/*===============Manage Customer====================*/
manageMenu.GetCustomerListView = function (userId){
$http({
method: "POST",
url: $rootScope.projectName+"/getCustomerListView",
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetCustomerListViewDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetCustomerListViewNotDone', data);
});
};

manageMenu.GetCustomerList = function (userId){
$http({
method: "POST",
url: $rootScope.projectName+"/getCustomerList",
}).success(function(data, status, header, config){
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetCustomerListDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetCustomerListNotDone', data);
});
};

manageMenu.GetCustomerDetails = function (customerCode){
$log.debug("GetCustomerDetails");
$log.debug(customerCode);
$http({
method: "POST",
url: $rootScope.projectName+"/getCustomerDetails?customerCode="+customerCode,
}).success(function(data, status, header, config){
$log.debug(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetCustomerDetailsDone', data); 
}
}).error(function(data, status, header, config){
$log.debug(data);
$rootScope.$broadcast('GetCustomerDetailsNotDone', data);
});
};

manageMenu.CreateCustomer = function (customerDetails){
$http({
method: "POST",
url: $rootScope.projectName+"/createCustomer?customerDetails="+customerDetails,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('CreateCustomerDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('CreateCustomerNotDone', data);
});
};

manageMenu.UpdateCustomer = function (customerDetails){
$http({
method: "POST",
url: $rootScope.projectName+"/updateCustomerDetails?customerDetails="+customerDetails,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateCustomerDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('UpdateCustomerNotDone', data);
});
};
manageMenu.DeleteCustomer = function (customerCode){
$http({
method: "POST",
url: $rootScope.projectName+"/deleteCustomer?customerCode="+customerCode,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteCustomerDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteCustomerNotDone', data);
});
};
/*=================MANAGE PRODUCT GROUP==================*/
manageMenu.GetProductGroupList = function (){
$http({
method: "POST",
url: $rootScope.projectName+"/getProductGroupList",
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductGroupListDone', data);
} 
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductGroupListNotDone', data);
});
};
manageMenu.GetProductGroupListView = function (){
$http({
method: "POST",
url: $rootScope.projectName+"/getProductGroupListView",
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductGroupListViewDone', data);
} 
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductGroupListViewNotDone', data);
});
};
manageMenu.GetProductGroupDetails = function (productGroupCode){
$http({
method: "POST",
url: $rootScope.projectName+"/getProductGroupDetails?productGroupCode="+productGroupCode,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductGroupDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductGroupDetailsNotDone', data);
});
};

manageMenu.CreateProductGroup = function (productDetails){
$http({
method: "POST",
url: $rootScope.projectName+"/createProductGroup?productDetails="+productDetails,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('CreateProductGroupDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('CreateProductGroupNotDone', data);
});
};

manageMenu.UpdateProductGroupDetails = function (productDetails){
$http({
method: "POST",
url: $rootScope.projectName+"/updateProductGroupDetails?productDetails="+encodeURIComponent(productDetails),
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateProductGroupDetailsDone', data);
} 
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('UpdateProductGroupDetailsNotDone', data);
});
};

manageMenu.DeleteProductGroup = function (productGroupCode){
$http({
method: "POST",
url: $rootScope.projectName+"/deleteProductGroup?productGroupCode="+productGroupCode,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteProductGroupDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteProductGroupNotDone', data);
});
};
/*========================MANAGE PRODUCT==============================*/
manageMenu.GetProductListView = function (fromLimit,toLimit){
console.log(fromLimit,toLimit)
$http({
method: "POST",
url: $rootScope.projectName+"/getProductListView?fromLimit="+fromLimit+"&toLimit="+toLimit,
// data:{fromLimit:fromLimit,toLimit:toLimit}
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductListViewDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductListViewNotDone', data);
});
};

manageMenu.GetProductList = function (prodLike){
$http({
method: "POST",
url: $rootScope.projectName+"/getProductList?prodLike="+prodLike,
}).success(function(data, status, header, config){
// console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductListDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductListNotDone', data);
});
};

manageMenu.GetSearchedProductListView = function (prodLike){
$http({
method: "POST",
url: $rootScope.projectName+"/getSearchedProductListView?prodLike="+prodLike,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetSearchedProductListViewDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetSearchedProductListViewNotDone', data);
});
};
manageMenu.GetProductDetails = function (productCode){
$http({
method: "POST",
url: $rootScope.projectName+"/getProductDetails?productCode="+productCode,
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('GetProductDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('GetProductDetailsNotDone', data);
});
};

manageMenu.CreateProduct = function (productDetails){
$http({
method: "POST",
url: $rootScope.projectName+"/createProduct?productDetails="+encodeURIComponent(productDetails),
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('CreateProductDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('CreateProductNotDone', data);
});
};

manageMenu.UpdateProductDetails = function (productDetails){
$http({
method: "POST",
url: $rootScope.projectName+"/updateProductDetails?productDetails="+encodeURIComponent(productDetails),
}).success(function(data, status, header, config){
//console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('UpdateProductDetailsDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('UpdateProductDetailsNotDone', data);
});
};

manageMenu.DeleteProduct = function (productCode){
$http({
method: "POST",
url: $rootScope.projectName+"/deleteProduct?productCode="+productCode,
}).success(function(data, status, header, config){
//console.log(data);
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('DeleteProductDone', data); 
}
}).error(function(data, status, header, config){
//console.log(data);
$rootScope.$broadcast('DeleteProductNotDone', data);
});
};
// ==========================ManageServices ===========================
manageMenu.GetServices = function (){
ManageServices.getServicesAPI.getServicesMethod(function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('GetServicesDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('GetServicesNotDone', error);
});
};

manageMenu.CreateService = function (service){
// console.log(termCondition)
ManageServices.createServiceAPI.createServiceMethod({service:service},function (success) {
console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('CreateServiceDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('CreateServiceNotDone', error);
});
};

manageMenu.UpdateService = function (service,id){
ManageServices.updateServiceAPI.updateServiceMethod({service:service,id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('UpdateServiceDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('UpdateServiceNotDone', error);
});
};

manageMenu.DeleteService = function (id){
ManageServices.deleteServiceAPI.deleteServiceMethod({id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('DeleteServiceDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('DeleteServiceNotDone', error);
});  
}

// ==========================Terms & Conditions===========================
manageMenu.GetTermsConditions = function (){
ManageServices.getTermsListAPI.getTermsListMethod(function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('GetTermsConditionsDone', success); 
}
}, function (error) {
console.log(error);
$rootScope.$broadcast('GetTermsConditionsNotDone', error);
});
};

manageMenu.CreateTermsConditions = function (termCondition){
// console.log(termCondition)
ManageServices.createTermsConditionsAPI.createTermsConditionsMethod({termCondition:termCondition},function (success) {
console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('CreateTermsConditionsDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('CreateTermsConditionsNotDone', error);
});
};


manageMenu.UpdateTermsConditions = function (termCondition,id){
ManageServices.updateTermsConditionsAPI.updateTermsConditionsMethod({termCondition:termCondition,id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('UpdateTermsConditionsDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('UpdateTermsConditionsNotDone', error);
});
};

manageMenu.DeleteTermCondition = function (id){
ManageServices.deleteTermConditionAPI.deleteTermConditionMethod({id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('DeleteTermConditionDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('DeleteTermConditionNotDone', error);
});
};
//================ Manage Alternate Product=======================
manageMenu.CreateAlternateProducts = function (alternateProductDetails){
console.log("CreateAlternateProducts")
console.log(alternateProductDetails)
data = $.param({alternateProductDetails:alternateProductDetails}); 
$http.post($rootScope.projectName+'/createAlternateProducts', data, config)
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

manageMenu.UpdateAlternateProducts = function (alternateProductDetails){
console.log("CreateAlternateProducts")
console.log(alternateProductDetails)
data = $.param({alternateProductDetails:alternateProductDetails}); 
$http.post($rootScope.projectName+'/updateAlternateProducts', data, config)
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

manageMenu.GetAlternateProductsView = function (){
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

manageMenu.DeleteAlternateProduct = function (mainId,altId){
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


//================ Manage Alternate Product=======================
manageMenu.SaveDataWithFile = function (uploadUrl,formData){
console.log(formData.get("offerDetail"));
$http.post(uploadUrl, formData,{
withCredentials: true,
headers: {'Content-Type': undefined },
transformRequest: angular.identity
})
.success(function(data, status, header, config){
console.log(data)
if (data.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', data);   
}else{
$rootScope.$broadcast('SaveDataWithFileDone', data); 
}
})
.error(function(data, status, header, config){
$rootScope.$broadcast('SaveDataWithFileNotDone', error);  

});
};

manageMenu.GetOffersList = function (){
console.log("GetAlternateProductsView")
ManageServices.getOffersList.getOffersListMethod(function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('GetOffersListDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetOffersListNotDone', error); 
});
};

manageMenu.DeleteOffer = function (id){
console.log(id)
ManageServices.deleteOffer.deleteOfferMethod({id:id},function (success) {
console.log(success)
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('DeleteOfferDone', success); 
}
}, function (error) {
console.log(error);
$rootScope.$broadcast('DeleteOfferNotDone', error);  
});
}  
//================= Manage Customer=========================

manageMenu.GetProductUploadProgress = function (){
console.log("GetProductUploadProgress")
ManageServices.getProductUploadProgressAPI.getProductUploadProgressMethod(function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('GetProductUploadProgressDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetProductUploadProgressNotDone', error); 
});
};

return manageMenu;
}])

.factory('ArrayOperationFactory', function(){
// var objectInfo={'subtotal':0,'gstTotal':0,'total':0};
return {
sayHello: function(text){
return "Factory says \"Hello " + text + "\"";
},
insertIntoArrayKeyValue: function(array,obj){
console.log("insertIntoArrayKeyValue")	
console.log(obj)	
array.push(obj);
return "success insertIntoArrayKeyValue";
},
deleteFromArrayKeyValue: function(array,obj1){
console.log("deleteFromArrayKeyValue")	
console.log(obj1)	
var objIndex = array.findIndex((obj => obj.key == obj1.key));
array.splice(objIndex,1);
// angular.forEach(array, function(element, index){
// if(element.key==obj.key&&element.value.toUpperCase()==obj.value.toUpperCase()){
// console.log(element)
// array.splice(index,1);
// }
// });
return "success deleteFromArrayKeyValue";
},
updateArrayKeyValue: function(array,obj1){
console.log("updateArrayKeyValue")	
console.log(obj1)	
objIndex = array.findIndex((obj => obj.key == obj1.key));
array[objIndex] = obj1;
// angular.forEach(array, function(element, index){
// if(element.key==obj.key){
// array[index]=obj;
// } 
// });
return "success update";
},
}
})
