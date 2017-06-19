angular.module('sq.SmartQuoteDesktop')
.config(['$stateProvider', function($stateProvider) { 
   // console.log("initialise OZAppRoute");
   $stateProvider
   .state('home', {
      abstract: true,
      controller:'SQHomeController',
      templateUrl:'SQ/Home/views/sq.home.view.html',
    })
   .state('home.start', {
      views: {
        'signin-view' : {
          templateUrl: 'SQ/Home/views/sq.signin.view.html',
        }
      }
    })
   .state('userhome', {
      abstract: true,
      controller:'SQUserHomeController',
      templateUrl:'SQ/UserHome/views/sq.user_home.tpl.html',
    })
   .state('userhome.start', {
      views: {
        'userhome-view' : {
          templateUrl: 'SQ/UserHome/views/sq.user_home.tpl.view.html',
        }
      }
    })
   .state('manageusergroup', {
      controller:'SQManageUserGroupController',
      templateUrl: 'SQ/UserHome/ManageMenus/views/sq.manage_user_group.view.html',
    })
   .state('manageuser', {
      controller:'SQManageUserController',
      templateUrl: 'SQ/UserHome/ManageMenus/views/sq.manage_user.view.html',
    })
   .state('managecustomer', {
      controller:'SQManageCustomerController',
      templateUrl: 'SQ/UserHome/ManageMenus/views/sq.manage_customer.view.html',
    })
   .state('manageproductgroup', {
      controller:'SQManageProductGroupController',
      templateUrl: 'SQ/UserHome/ManageMenus/views/sq.manage_product_group.view.html',
    })
   .state('manageproduct', {
      controller:'SQManageProductController',
      templateUrl: 'SQ/UserHome/ManageMenus/views/sq.manage_product.view.html',
    })
   .state('uploadproductfile', {
      controller:'SQUploadProductFileController',
      templateUrl: 'SQ/UserHome/ManageMenus/views/sq.upload_product_file.view.html',
    })
   .state('managetermsconditions', {
      controller:'SQManageTermsConditionsController',
      templateUrl: 'SQ/UserHome/ManageMenus/views/sq.manage_Terms&Conditions.view.html',
    })
   .state('manageservices', {
      controller:'SQManageServicesController',
      templateUrl: 'SQ/UserHome/ManageMenus/views/sq.manage_services.view.html',
    })
   .state('createquote', {
      controller:'SQCreateQuoteController',
      templateUrl: 'SQ/UserHome/Quote/views/sq.create_quote.view.html',
    })
   .state('vieweditquote', {
      controller:'SQViewEditQuoteController',
      templateUrl: 'SQ/UserHome/Quote/views/sq.view_edit_quote.view.html',
    });

}]);