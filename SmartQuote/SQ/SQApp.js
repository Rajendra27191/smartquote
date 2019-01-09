jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "date-euro-pre": function (a) {
                return moment(a, 'DD-MM-YYYY HH:mm');
            },

            "date-euro-asc": function (a, b) {
               
                if (a.isBefore(b))
                    return -1;
                else if (b.isBefore(a))
                    return 1;
                else
                    return 0;
            },

            "date-euro-desc": function (a, b) {

                if (a.isBefore(b))
                    return 1;
                else if (b.isBefore(a))
                    return -1;
                else
                    return 0;
            }
});


var app = angular.module('sq.SmartQuoteDesktop', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'ngResource', 'ngAnimate', 'angularLocalStorage', 'uiSwitch', 'datatables', 'cfp.hotkeys', 'angular-svg-round-progressbar', 'angularUtils.directives.dirPagination', 'siyfion.sfTypeahead', 'angularFileUpload', 'googlechart', 'angular.filter'])
  .config(function ($logProvider) {
    // console.log(".config")
    $logProvider.debugEnabled(true);

    // ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });

  })
  .run(['$rootScope', '$window', 'storage', '$templateCache', function ($rootScope, $window, storage, $templateCache) {
    $rootScope.projectName = "/";

    var currentURL = $window.location.href;
//   var currentURL = "http://localhost:6003/smartprotest/";  // -- Comment while deploying on PROD & QA


    var isSmartProTest = currentURL.includes("smartprotest");
    if (isSmartProTest) {
      $rootScope.projectName = "/smartprotest";
      $rootScope.storageName = "smartprotest";
      if (storage.get('smartprotest') == null || storage.get('smartprotest') == '') {
        $rootScope.smartprotest = {};
      }
      storage.bind($rootScope, 'smartprotest', {});
    } else {
      // $rootScope.projectName="/smartpro";
      $rootScope.projectName = "/smartpro";
      $rootScope.storageName = "smartpro";
      if (storage.get('smartpro') == null || storage.get('smartpro') == '') {
        $rootScope.smartpro = {};
      }
      storage.bind($rootScope, 'smartpro', {});
    };
    console.log("URL: " + currentURL);
    // console.log("Project: "+$rootScope.projectName);

  }])
  .controller('SmartQuoteDesktopController', ['$log', '$scope', '$rootScope', '$window', '$location', '$anchorScroll', '$state', '$filter', '$timeout', '$http', 'notify', 'SQHomeServices', '$interval','SQUserHomeServices', function ($log, $scope, $rootScope, $window, $location, $anchorScroll, $state, $filter, $timeout, $http, notify, SQHomeServices, $interval,SQUserHomeServices) {
    console.log("SmartQuoteDesktopController initialise");
    $window.pageYOffset;
    $scope.user = {};
    $scope.form = {};
    $scope.invalidEmailPassword = false;
    $scope.errormsg = '';
    $rootScope.isAdmin = false;
    $rootScope.isSessionExpired = false;
    $rootScope.isUserSignIn = false;
    $rootScope.initDashBoard = true;
    $rootScope.initAuotoCompleteDone = false;
    // $rootScope.scrollpos=0;
    $rootScope.regex = {
      'email': /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/
    };
    //$rootScope.emailRegex=/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    // $state.transitionTo('home.start');
   
    $('#mySpinner').show();
    SQHomeServices.apiCallToCheckUserSession();
    // SQHomeServices.getUpdatedUserData();
    /*================ Check user is in sesssion========================*/
    $scope.setLocalStorageData = function (data) {
      //     console.log("setLocalStorageData")
      // console.log(data)
      if (data) {
        if (data.userNavMenu && data.userData && data.userList && data.customerList && data.supplierList && data.termConditionList && data.offerList) {
          $rootScope.isUserSignIn = true;
          $rootScope.userNavMenu = data.userNavMenu;
          $rootScope.userData = {
            'userId': data.userData.userId,
            'userGroupId': data.userData.userGroupId,
            'userType': data.userData.userType,
            'emailId': data.userData.emailId,
            'contact': data.userData.contact,
            'userName': data.userData.userName,
            'paymentReminderAccess': data.userData.paymentReminderAccess,
            'validFrom': data.userData.validFrom,
            'validTo': data.userData.validTo
          }
          $rootScope.userList = data.userList;
          $rootScope.customerList = data.customerList;
          $rootScope.supplierList = data.supplierList;
          $rootScope.serviceList = data.serviceList;
          $rootScope.termConditionList = data.termConditionList;
          $rootScope.offerList = data.offerList;
        } else {
          $rootScope.isUserSignIn = false;
        }
      } else {
        $rootScope.isUserSignIn = false;
      }

    };

    $scope.isPaymentReminderAccess = function (menuName) {
      var isAccess = true;
      if (menuName == "Application" && $rootScope.userData.paymentReminderAccess == "NO") {
        isAccess = false;
      }
      return isAccess;
    }

    $scope.clearLocalStorageData = function () {
      console.log("clearLocalStorageData")
      $rootScope.isUserSignIn = false;
      $rootScope.initDashBoard = true;
      $rootScope.userNavMenu = [];
      $rootScope.userData = {};
      $rootScope.userList = [];
      $rootScope.customerList = [];
      $rootScope.supplierList = [];
      $rootScope.serviceList = [];
      $rootScope.termConditionList = [];
      $rootScope.offerList = [];
      if ($rootScope.storageName.toLowerCase() == "smartprotest") {
        $rootScope.smartprotest = {};
      } else {
        $rootScope.smartpro = {};
      }
    }
    $rootScope.$on("sesssion", function (event, data) {
      // console.log("sesssion")
      // console.log(data)
      if (data.code == "success") {
        $('#mySpinner').hide();
        if ($rootScope.storageName.toLowerCase() == "smartprotest") {
          $scope.setLocalStorageData($rootScope.smartprotest);
        } else {
          $scope.setLocalStorageData($rootScope.smartpro);
        }
        if ($rootScope.isUserSignIn) {
          SQHomeServices.getUpdatedUserData();
          $state.transitionTo('userhome.start');
        } else {
          $state.transitionTo('home.start');
          $scope.clearLocalStorageData();
          $('#mySpinner').hide();
        }
      } else {
        $state.transitionTo('home.start');
        $scope.clearLocalStorageData();
        $('#mySpinner').hide();
      }
      // console.log("isUserInSession ",$rootScope.isUserSignIn);
    });

    // if ($rootScope.isUserSignIn) {
    // $state.transitionTo('userhome.start');
    // }else{
    // $state.transitionTo('home.start');
    // }

    // console.log("$rootScope.initDashBoard :" ,$rootScope.initDashBoard)
    /*===================================================*/
    $rootScope.initAuotoComplete = function (callWithTimeStamp) {
      console.log("$rootScope.initAuotoComplete...");
      var objURL = "";
      var timestamp = new Date().getTime();
      var fileURL = $rootScope.projectName + "/products.json"
      var isCache = false;
      if (callWithTimeStamp) {
        fileURL = $rootScope.projectName + "/products.json?" + timestamp,
          isCache = false;
      }
      console.log("fileURL : " + fileURL)
      products = new Bloodhound({
        datumTokenizer: function (d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
          // url: $rootScope.projectName+"/products.json?"+timestamp,
          url: fileURL,
          cache: isCache,
          beforeSend: function (xhr) {
            $rootScope.showSpinner();
            $rootScope.initAuotoCompleteDone = false;
          },
          filter: function (devices) {
            $rootScope.hideSpinner();
            $('#mySpinner').hide();
            $rootScope.initAuotoCompleteDone = true;
            return $.map(devices, function (device) {
              return {
                code: device.code,
                value: device.value
              };
            });
          }
        },
      });
      products.clearPrefetchCache();
      products.initialize();
      $rootScope.productsDataset = {
        displayKey: 'value',
        limit: 200,
        // async: false,
        source: products.ttAdapter(),
      };
      $rootScope.exampleOptions = {
        displayKey: 'title',
        highlight: true
      };
      //----------------------
//      $timeout(function() {
//      $rootScope.hideSpinner();
//      $('#mySpinner').hide();
//      }, 2000);
      
    };
    /*===================================================*/
    $rootScope.userSignin = function () {
      if ($scope.form.loginUser.$valid) {
        $rootScope.showSpinner();
        SQHomeServices.userLogIn($scope.user.userName, $scope.user.userPassword);
      } else {
        $scope.form.loginUser.submitted = true;
      }

    };

    $scope.handleUserLogInDoneResponse = function (data) {
      if (data) {
        //console.log(data);  
        if (data.code) {
          if (data.code.toUpperCase() == 'SUCCESS') {
            //console.log("lllllllllllllllll");
            $state.transitionTo('userhome.start');
            // $rootScope.SQNotify("Successfully log in",'success');
            $scope.user = {};
            $scope.invalidEmailPassword = false;
            $rootScope.isSessionExpired = false;
            if ($scope.form.loginUser) {
              $scope.form.loginUser.submitted = false;
              $scope.form.loginUser.$setPristine();
            }

            if ($rootScope.storageName.toLowerCase() == "smartprotest") {
              $rootScope.smartprotest.isUserSignIn = true;
              $rootScope.smartprotest.userNavMenu = data.userMenuList;
              $rootScope.smartprotest.userData = {
                'userId': data.userData.userId,
                'userGroupId': data.userData.userGroupId,
                'userType': data.userData.userType,
                'emailId': data.userData.emailId,
                'contact': data.userData.contact,
                'userName': data.userData.userName,
                'paymentReminderAccess': data.userData.paymentReminderAccess,
                'validFrom': data.userData.validFrom,
                'validTo': data.userData.validTo
              }
              $rootScope.smartprotest.userList = data.userList;
              $rootScope.smartprotest.customerList = data.customerList;
              $rootScope.smartprotest.supplierList = data.supplierList;
              $rootScope.smartprotest.serviceList = data.serviceList;
              $rootScope.smartprotest.termConditionList = data.termConditionList;
              $rootScope.smartprotest.offerList = data.offerList;
              $scope.setLocalStorageData($rootScope.smartprotest);

            } else {
              $rootScope.smartpro.isUserSignIn = true;
              $rootScope.smartpro.userNavMenu = data.userMenuList;
              $rootScope.smartpro.userData = {
                'userId': data.userData.userId,
                'userGroupId': data.userData.userGroupId,
                'userType': data.userData.userType,
                'emailId': data.userData.emailId,
                'contact': data.userData.contact,
                'userName': data.userData.userName,
                'paymentReminderAccess': data.userData.paymentReminderAccess,
                'validFrom': data.userData.validFrom,
                'validTo': data.userData.validTo
              }
              $rootScope.smartpro.userList = data.userList;
              $rootScope.smartpro.customerList = data.customerList;
              $rootScope.smartpro.supplierList = data.supplierList;
              $rootScope.smartpro.serviceList = data.serviceList;
              $rootScope.smartpro.termConditionList = data.termConditionList;
              $rootScope.smartpro.offerList = data.offerList;

              $scope.setLocalStorageData($rootScope.smartpro);

            };
            // $rootScope.initAuotoComplete();

          }
          else if (data.code.toUpperCase() == 'ERROR') {
            //$rootScope.alertError(data.message);
            $scope.invalidEmailPassword = true;
            $scope.errormsg = data.message;
            $rootScope.hideSpinner();
          }

        }
      }
    };

    var cleanupEventUserLogInDone = $scope.$on("UserLogInDone", function (event, message) {
      // console.log("UserLogInDone");
      // console.log(message);
      $scope.handleUserLogInDoneResponse(message);
    });

    var cleanupEventUserLogInNotDone = $scope.$on("UserLogInNotDone", function (event, message) {
      $rootScope.SQNotify("Server error please try after some time", 'failure');
      $rootScope.hideSpinner();
    });

    $rootScope.userSignout = function () {
      // console.log("signout")
      $rootScope.showSpinner();
      SQHomeServices.userLogOut();
    };

    $scope.handleUserLogOutDoneResponse = function (data) {
      if (data) {
        if (data.code) {
          if (data.code.toUpperCase() == 'SUCCESS') {
            $state.transitionTo('home.start');
            $scope.clearLocalStorageData();
            // $rootScope.SQNotify("Successfully log out",'success'); 
          } else {
            $rootScope.alertError(data.message);
          }
          $rootScope.hideSpinner();
        }
      }
    };

    var cleanupEventUserLogOutDone = $scope.$on("UserLogOutDone", function (event, message) {
      // console.log("UserLogOutDone");
      $scope.handleUserLogOutDoneResponse(message);
    });

    var cleanupEventUserLogOutNotDone = $scope.$on("UserLogOutNotDone", function (event, message) {
      $rootScope.alertServerError("Server error please try after some time", 'error');
    });
    /*===================================================*/
    /*============== FORGET PASSWORD===========*/
    $scope.isForgotPasswordOn = false;
    $scope.forgotPasswordClicked = function () {
      $scope.invalidEmailPassword = false;
      $scope.isForgotPasswordOn = true;

    };

    $scope.cancelForgetPassword = function () {
      $scope.invalidEmailPassword = false;
      $scope.isForgotPasswordOn = false;
    };

    $scope.submitForgetPassword = function () {
      if ($scope.form.forgotPassword.$valid) {
        // console.log($scope.user.userName);
        $rootScope.showSpinner();
        SQHomeServices.userForgotPassword($scope.user.userName);
      } else {
        $scope.form.forgotPassword.submitted = true;
      }

    };
    $scope.handleUserForgotPasswordDoneResponse = function (data) {
      if (data) {
        if (data.code) {
          if (data.code.toUpperCase() == 'SUCCESS') {
            $rootScope.alertSuccess("Successfully reset password, please check your inbox for new password");
            $scope.user = {};
            $scope.invalidEmailPassword = false;
            $scope.form.forgotPassword.submitted = false;
            $scope.form.forgotPassword.$setPristine();
            $scope.isForgotPasswordOn = false;
          }
          else if (data.code.toUpperCase() == 'ERROR') {
            // $rootScope.alertError(data.message);
            $scope.invalidEmailPassword = true;
            $scope.errormsg = data.message;

          }
          $rootScope.hideSpinner();
        }
      }
    };

    var cleanupEventUserForgotPasswordDone = $scope.$on("UserForgotPasswordDone", function (event, message) {
      // console.log("UserForgotPasswordDone");
      // console.log(message);
      $scope.handleUserForgotPasswordDoneResponse(message);
    });

    var cleanupEventUserForgotPasswordNotDone = $scope.$on("UserForgotPasswordNotDone", function (event, message) {
      $rootScope.alertServerError("Server error");
      $rootScope.hideSpinner();
    });

    /*============== FORGET PASSWORD===========*/
    $rootScope.getPrice = function (price) {
      // console.log(price) 
      var price1 = parseFloat(price);
      if (price1 == '') {
        price1 = 0;
      } else {
        price1 = price1.toFixed(2);
      }
      return price1;
    };

    /*===============SESSION TIME OUT STARTS=====================*/
    $scope.redirectToLogin = function () {
      $rootScope.isUserSignIn = false;
      $rootScope.userNavMenu = [];
      $state.transitionTo('home.start');
    };

    $scope.handleSessionTimeOutResponse = function (data) {
      if (data) {
        $state.transitionTo('userhome.start');
        $rootScope.isSessionExpired = true;
        //$rootScope.alertError("Session Time Out Please Login To Continue");
      }

      $rootScope.hideSpinner();
    };

    var cleanupEventSessionTimeOut = $scope.$on("SessionTimeOut", function (event, message) {
      $scope.handleSessionTimeOutResponse(message);
    });

    /*===============SESSION TIME OUT ENDS=====================*/
    /*===============Get Updated UserData=====================*/
    $scope.setArray = function (existingArray, newArray) {
      existingArray.length = 0;
      existingArray.push.apply(existingArray, newArray);
      // existingArray.splice(0,existingArray.length)
      // existingArray=JSON.parse(JSON.stringify(newArray));
    };
    $scope.setUpdatedUserData = function (data) {
      console.log("setUpdatedUserData");
      $scope.setArray($rootScope.userNavMenu, data.userMenuList);
      $scope.setArray($rootScope.userList, data.userList);
      $scope.setArray($rootScope.customerList, data.customerList);
      $scope.setArray($rootScope.supplierList, data.supplierList);
      $scope.setArray($rootScope.serviceList, data.serviceList);
      $scope.setArray($rootScope.termConditionList, data.termConditionList);
      $scope.setArray($rootScope.offerList, data.offerList);
      $rootScope.$broadcast('setUpdatedUserDataDone', 'success');
    };
    $rootScope.getUpdatedUserData = function () {
      $rootScope.showSpinner();
      SQHomeServices.getUpdatedUserData();
    };
    $scope.handleGetUpdatedUserDataDoneResponse = function (data) {
      if (data) {
        if (data.code) {
          if (data.code.toUpperCase() == 'SUCCESS') {
            $scope.setUpdatedUserData(data);
          }
          else if (data.code.toUpperCase() == 'ERROR') {

          }
          $rootScope.hideSpinner();
        }
      }
    };

    var cleanupEventGetUpdatedUserDataDone = $scope.$on("GetUpdatedUserDataDone", function (event, message) {
      console.log("cleanupEventGetUpdatedUserDataDone");
      console.log(message);
      $scope.handleGetUpdatedUserDataDoneResponse(message);
    });

    var cleanupEventGetUpdatedUserDataNotDone = $scope.$on("GetUpdatedUserDataNotDone", function (event, message) {
      $rootScope.alertServerError("Server error");
      $rootScope.hideSpinner();
    });


    /*===============Get Updated UserData=====================*/
    $rootScope.moveToTop = function () {
      console.log("moveToTop")
      $window.pageYOffset;
      $window.scrollTo(0, 0);
    }

    $rootScope.SQNotify = function (message, flag) {
      if (flag === 'success') {
        notify({ message: message, template: 'assets/notification/views/oz.success.tpl.html', position: 'center' });
      }
      else if (flag === 'failure') {
        notify({ message: message, template: 'assets/notification/views/oz.failure.tpl.html', position: 'center' });
      }
      else if (flag === 'central') {
        notify({ message: message, template: 'assets/notification/views/oz.central.tpl.html', position: 'center' });
      }
      else if (flag === 'error') {
        notify({ message: message, template: 'assets/notification/views/oz.error.tpl.html', position: 'center' });
      }
    };

    $rootScope.alertSuccess = function (message) {
      sweetAlert("Success", message, "success");
    };
    $rootScope.alertError = function (message) {
      sweetAlert("Oops!", message, "error");
    };
    $rootScope.alertServerError = function (message) {
      sweetAlert("Error", message, "error");
    };
    $rootScope.alertWarning = function (message) {
      sweetAlert("Oops!", message, "warning");
    };
    $rootScope.alertSessionTimeOutOnQuote = function () {
      swal({
        title: "<h4 style='color:#F8BB86'>Session Expired</h4><h4>Quote saved partially with status 'INI' </h4>",
        // text: "your quote partially saved with status 'INI' you can complete quote from Edit/View Quote.",
        html: true
      });
    };


    $scope.checkQuoteActivated = function () {
      // console.log("reload isQuoteActivated");  
      // console.log($rootScope.isQuoteActivated)  ;
      $(window).bind("beforeunload", function (event) {
        if ($rootScope.isQuoteActivated) {
          return "";

        }
      });
    };
    $scope.checkQuoteActivated();
    $interval($scope.checkQuoteActivated, 1000);
    //---------------------------------------------------
    $rootScope.refreshProductFileJson = function () {
      $rootScope.showSpinner();
      SQUserHomeServices.RefreshProductFile();
    };
    
    $scope.handleRefreshProductFileDoneResponse = function (data) {
      if (data) {
        if (data.code) {
          if (data.code.toUpperCase() == 'SUCCESS') {
            $rootScope.initAuotoComplete(true);
          }else {
            $rootScope.hideSpinner();
          }
        }
      }
    };
    
    var cleanupEventRefreshProductFileDone = $scope.$on("RefreshProductFileDone", function (event, message) {
      $scope.handleRefreshProductFileDoneResponse(message);
    });
    
    var cleanupEventRefreshProductFileNotDone = $scope.$on("RefreshProductFileNotDone", function (event, message) {
      $rootScope.alertServerError("Server error");
      $rootScope.hideSpinner();
    });

    //---------------------------------------------------
    $scope.shouldShowSubmenu = function (submenu) {
      // put your authorization logic here
      // return submenu.subMenuName !== 'Create Proposal';
      return true;
    }

    $rootScope.getFormattedDate = function (date) {
      var dt = new Date(date);
      var fDate = moment(dt).format("DD-MM-YYYY");
      return fDate;
    };
    $scope.$on('$destroy', function (event, message) {
      cleanupEventUserLogInDone();
      cleanupEventUserLogInNotDone();
      cleanupEventUserLogOutDone();
      cleanupEventUserLogOutNotDone();
      cleanupEventUserForgotPasswordDone();
      cleanupEventUserForgotPasswordNotDone();
      cleanupEventGetUserGroupInfoDone();
      cleanupEventGetUserGroupMenuDone();
      cleanupEventSessionTimeOut();
      cleanupEventRefreshProductFileDone();
      cleanupEventRefreshProductFileNotDone();
    });


  }])
  .factory('beforeUnload', function ($rootScope, $window) {
    // Events are broadcast outside the Scope Lifecycle

    $window.onbeforeunload = function (e) {
      var confirmation = {};
      var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
      if (event.defaultPrevented) {
        return confirmation.message;
      }
    };

    $window.onunload = function () {
      $rootScope.$broadcast('onUnload');
    };
    return {};
  })
  .run(function (beforeUnload) {
    // Must invoke the service at least once
  });
