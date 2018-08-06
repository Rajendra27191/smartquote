angular.module('sq.SmartQuoteDesktop')
    .controller('SQAutoSaveQuoteConroller',
        function ($uibModal, $scope, $rootScope, $window, $anchorScroll, $log, $state, $timeout, SQManageMenuServices, hotkeys, $http, SQQuoteServices, CalculationFactory, ArrayOperationFactory, DTOptionsBuilder, DTColumnDefBuilder) {
            console.log('initialise SQAutoSaveQuoteConroller');
            $scope.form = {};
            $scope.customerQuote = {};
            $scope.isCustomerSelected = false;
            $scope.isCustomerInvalid = false;
            var isSupplierExist = false;
            $scope.competeQuote = ["Yes", "No"];
            $scope.customerQuote = {
                'competeQuote': "No",
                'salesPerson': "",
            };
            $scope.currentSupplierList = [];
            $scope.isProposalGenerated = false;
            $scope.showProposal = true;
            $scope.isCollapsed = true;
            $scope.collapseDiv = function () {
                $scope.isCollapsed = !$scope.isCollapsed;
            };
            $scope.customerQuote.productList = [];
            $scope.addedProductList = [];
            $scope.addProduct = {};
            $scope.customerQuote.saveWithAlternative = false;
            $scope.isNewProductCreatedByQuote = false;
            $rootScope.addedProductCount = 0;

            //==============================================================================================
            //----------------- AUTOSAVE PROPOSAL -----------------
            //==============================================================================================     
            if ($rootScope.userData) {
                if ($rootScope.userData.userType.toLowerCase() == "admin") {
                    $scope.disableSalesPersonSelect = false;
                } else {
                    $scope.disableSalesPersonSelect = true;
                }
            };
            //======= Scroll >>>>>
            $(window).scroll(function () {
                if ($(document).scrollTop() > 70) {
                    $('.moveTop').show();
                } else {
                    $('.moveTop').hide();
                }
            });
            $scope.moveToCustomerInfo = function () {
                $window.scrollTo(0, 0);
                $("#customerCode").focus();
            }
            //======= Scroll <<<<<
            //======= Date Control >>>>>
            $scope.today = function () {
                $scope.dt = new Date();
                return $scope.dt;
            };
            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.initDate = function () {
                $scope.popup1 = {};
                $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = "dd-MM-yyyy"//$scope.formats[1];
                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1,
                    showWeeks: false
                };
                $scope.customerQuote.createdDate = $scope.today();
            };
            // ======= Customer Panel Code >>>>>
            $scope.currentSupplierNameChanged = function () {
                if ($scope.customerQuote.currentSupplierName != '') {
                    $scope.customerQuote.competeQuote = 'Yes';
                }
                if ($scope.customerQuote.currentSupplierName == '') {
                    $scope.customerQuote.competeQuote = 'No';
                }
            }

            $scope.isCurrentSupplierNameRequired = false;
            $scope.competeQuoteChanged = function () {
                console.log("$scope.customerQuote.competeQuote")
                console.log($scope.customerQuote.competeQuote)
                if ($scope.customerQuote.competeQuote == 'No') {
                    if ($scope.customerQuote.productList) {
                        if ($scope.customerQuote.productList.length > 0) {
                            $scope.showConfirmationWindow();
                        } else {
                            $scope.isCurrentSupplierNameRequired = false;
                            $scope.customerQuote.currentSupplierName = "";
                        }
                    } else {
                        $scope.isCurrentSupplierNameRequired = false;
                        $scope.customerQuote.currentSupplierName = "";
                    }
                }
                if ($scope.customerQuote.competeQuote == 'Yes') {
                    $scope.isCurrentSupplierNameRequired = true;
                }
            };

            $scope.customerCodeChanged = function (code) {
                var customerCode = code;
                $scope.isNewCustomer = true;
                if (customerCode != undefined) {
                    angular.forEach($scope.customerList, function (customer, index) {
                        if (customerCode.code) {
                            if (customer.code.toUpperCase() == customerCode.code.toUpperCase()) {
                                // console.log("old")
                                $scope.isNewCustomer = false;
                            }
                        }
                    });
                }
                if ($scope.isNewCustomer) {
                    var code = $scope.customerQuote.customerCode;
                    // $scope.customerQuote={};
                    $scope.customerQuote.customerCode = '';
                    $scope.customerQuote.customerName = '';
                    $scope.customerQuote.address = '';
                    $scope.customerQuote.phone = '';
                    $scope.customerQuote.email = '';
                    $scope.customerQuote.fax = '';
                    $scope.customerQuote.attn = '';
                    $scope.customerQuote.customerCode = code;
                    $scope.filepreview = '';
                } else {
                    $scope.getCustomerDetails(customerCode);
                }
                // console.log("$scope.isNewCustomer  "+$scope.isNewCustomer)
            };

            $scope.checkIfSupplierExist = function () {
                isSupplierExist = false;
                var supplier = {}
                angular.forEach($scope.currentSupplierList, function (currentSupplier, key) {
                    if ($scope.customerQuote.currentSupplierName != undefined && $scope.customerQuote.currentSupplierName != '' && $scope.customerQuote.currentSupplierName != null) {
                        if ($scope.customerQuote.currentSupplierName.key) {
                        } else {
                            if ($scope.customerQuote.currentSupplierName.toUpperCase() == currentSupplier.value.toUpperCase()) {
                                isSupplierExist = true;
                                console.log(currentSupplier);
                                supplier.key = currentSupplier.key;
                                supplier.value = currentSupplier.value.toUpperCase();
                                supplier.code = currentSupplier.value.toUpperCase();
                                $scope.customerQuote.currentSupplierName = supplier;
                            }
                        }
                    }
                });
                if (isSupplierExist) {
                    $scope.form.addCustomerQuote.currentSupplierName.$invalid = true;
                    $('#currentSupplierName').focus();
                } else {
                    $scope.form.addCustomerQuote.currentSupplierName.$invalid = false;
                }
            };
            /*===================GET CUSTOMER DETAILS=================*/
            $scope.assignCustomerDetails = function (data) {
                var address = '';
                address = data.address1;
                console.log("asssigning data to customer")
                $scope.customerQuote.customerCode = data.customerCode;
                $scope.customerQuote.customerName = data.customerName;
                $scope.customerQuote.attn = data.contactPerson;
                //$scope.customerQuote.address = data.address;
                $scope.customerQuote.address=data.address1;
                $scope.customerQuote.phone = data.phone;
                $scope.customerQuote.email = data.email;
                $scope.customerQuote.fax = data.fax;
                $scope.filepreview = data.customerLogoSrc;
            };

            $scope.getCustomerDetails = function (customer) {
                // console.log(customer);
                $rootScope.showSpinner();
                SQManageMenuServices.GetCustomerDetails(customer.code);
            };

            $scope.handleGetCustomerDetailsDoneResponse = function (data) {
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            $scope.assignCustomerDetails(data.objResponseBean);
                            $scope.isCustomerSelected = true;
                            $scope.isCustomerInvalid = false;
                        } else {
                            $rootScope.alertError(data.message);
                        }
                        $rootScope.hideSpinner();
                    }
                }
            };

            var cleanupEventGetCustomerDetailsDone = $scope.$on("GetCustomerDetailsDone", function (event, message) {
                $scope.handleGetCustomerDetailsDoneResponse(message);
            });

            var cleanupEventGetCustomerDetailsNotDone = $scope.$on("GetCustomerDetailsNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });
            // ======= Customer Panel Code >>>>>    
            //===================File Upload====================  
            $scope.dynamicPopover = {
                templateUrl: 'myPopoverTemplate.html',
                title: 'Customer Logo'
            };

            $scope.filepreview = "";
            var latestFile = null;
            var logoFile = null;
            $scope.onFileSelect = function ($files) {
                console.log("onFileSelect");
                console.log($files);
                console.log($files.length);
                if ($files.length > 0) {
                    for (var i = 0; i < $files.length; i++) {
                        var fileType = $files[i].name.split('.').pop().toLowerCase();
                        if ((fileType == 'jpg' || fileType == 'jpeg' || fileType == 'gif' || fileType == 'png')) {
                            console.log("valid file");
                            latestFile = $files[i];
                            $scope.file = latestFile
                            if ((latestFile.size / 1024) <= 100) {//6144
                                $scope.invalidFileSize = false;
                                logoFile = latestFile;
                                $scope.isFileNull = false;
                            } else {
                                console.log("invalid file size");
                                $scope.invalidFileSize = true;
                            }
                        } else {
                            console.log("invalid file");
                            $scope.isInvalid = true;
                            $scope.invalidFile = true;
                            $scope.isFileNull = true;
                            latestFile = null;
                            logoFile = null;
                            document.getElementById('fileTypeExcelHost').value = '';
                        }
                    }
                } else {
                    $scope.isFileNull = true;
                    latestFile = null;
                    logoFile = null;
                };
            };

            $scope.viewCustomerLogo = function (filepreview) {
                console.log("viewCustomerLogo");
                $('#custLogoModal').modal({ keyboard: false, backdrop: 'static', show: true });
                console.log("");
                $scope.custLogoSrc = filepreview;
            };

            $scope.shouldShow = function (user) {
                // put your authorization logic here
                return user.code !== 1 && user.value !== 'admin';
            }

            //===== GET PRODUCT GROUP LIST >>>>>
            $scope.productGroupList = []
            $scope.getProductGroup = function () {
                console.log("getProductGroup")
                $rootScope.showSpinner();
                SQManageMenuServices.GetProductGroupList();
            };

            $scope.handleGetGetProductGroupListDoneResponse = function (data) {
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            $scope.productGroupList = data.result;
                            $rootScope.isQuoteActivated = true;
                            $rootScope.getUpdatedUserData();
                        } else {
                            $rootScope.hideSpinner();
                            $rootScope.alertError(data.message);
                        }
                    }
                    // $rootScope.hideSpinner();
                }
            };

            var cleanupEventGetProductGroupListDone = $scope.$on("GetProductGroupListDone", function (event, message) {
                console.log("GetProductGroupListDone");
                $scope.handleGetGetProductGroupListDoneResponse(message);
            });

            var cleanupEventGetProductGroupListNotDone = $scope.$on("GetProductGroupListNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });
            //===== GET PRODUCT GROUP LIST <<<<<
            // ===== INIT() CreateQuote >>>>>>
            function setUserAsSalesPerson() {
                console.log("setUserAsSalesPerson");
                angular.forEach($rootScope.userList, function (element, key) {
                    if (element.key == $rootScope.userData.userId && element.value == $rootScope.userData.userName) {
                        if (element.key !== 1 && element.value !== 'admin') {
                            $scope.customerQuote.salesPerson = element;
                        }
                    }
                });
            }
            $scope.$on("setUpdatedUserDataDone", function (event, message) {
                console.log("setUpdatedUserDataDone")
                if (message.toLowerCase() == "success") {
                    $scope.currentSupplierList = angular.copy($rootScope.supplierList);
                    $scope.termConditionArray = angular.copy($rootScope.termConditionList);
                    $scope.serviceArray = angular.copy($rootScope.serviceList);
                    $scope.offerArray = angular.copy($rootScope.offerList);
                    setUserAsSalesPerson();//
                    $scope.initDate();
                }
            });

            $scope.initCreateQuote = function (status) {
                console.log("initCreateQuote");
                if (status.toLowerCase() == 'init1') {
                    console.log("init1");
                    $scope.getProductGroup();//get product group list for add product
                } else {
                    console.log("init2");
                    $rootScope.getUpdatedUserData();
                };
            };
            $scope.initCreateQuote('init1');
            // ======= INIT() CreateQuote <<<<<<
            // ======= Reset & Cancel Quote >>>>>
            $scope.resetCreateQuote = function () {
                $log.debug("resetCreateQuote call");
                $scope.isProposalGenerated = false;
                $scope.customerQuote = {};
                $scope.customerQuote.productList = {};
                $scope.customerQuote.productList = [];
                $scope.addedProductList = [];
                $scope.isAddProductModalShow = false;
                $scope.supplierInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
                $scope.totalInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
                $scope.gpInformation = { 'avgGpRequired': 0, 'avgCurrentSupplierGp': 0 };
                $scope.altSupplierInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
                $scope.altTotalInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
                $scope.altGpInformation = { 'avgGpRequired': 0, 'avgCurrentSupplierGp': 0 };
                isSupplierExist = false;
                $scope.isNewCustomer = false;
                $scope.customerQuote.competeQuote = "No";
                $scope.isAlternateAdded = false;
                $scope.customerQuote.saveWithAlternative = false;
                $scope.showAddProductError = false;
                $scope.form.addCustomerQuote.submitted = false;
                $scope.form.addCustomerQuote.$setPristine();
                $scope.initCreateQuote('init2');
                $rootScope.addedProductCount = 0;
                $scope.isNewProductCreatedByQuote = false;
            };
            // ======= GenrateQuote >>>>>>
            $scope.showGenerateConfirmationWindow = function () {
                var previousWindowKeyDown = window.onkeydown;
                swal({
                    title: 'Are you sure?',
                    text: "After generating proposal.User would not be able to edit Customer Information",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    cancelButtonText: "Cancel",
                    confirmButtonText: "Confirm"
                }, function (isConfirm) {
                    if (isConfirm) {
                        //$scope.resetCurrentSupplier();
                        $rootScope.hideSpinner();
                        SQQuoteServices.GenerateProposal(logoFile, $scope.jsonToGenerateQuote());
                    } else {
                        $scope.customerQuote.competeQuote = 'Yes';
                    }
                });
            };

            $scope.jsonToGenerateQuote = function () {
                var objQuoteBean = {};
                supplierName = '';
                supplierId = null;
                var salesPerson = '';
                var salesPersonId = null;
                if ($scope.customerQuote.currentSupplierName != undefined) {
                    if ($scope.customerQuote.currentSupplierName.key) {
                        supplierName = $scope.customerQuote.currentSupplierName.value;
                        supplierId = $scope.customerQuote.currentSupplierName.key
                    } else {
                        if ($scope.customerQuote.currentSupplierName != "") {
                            supplierName = $scope.customerQuote.currentSupplierName;
                            supplierId = 0;
                        } else {
                            supplierName = $scope.customerQuote.currentSupplierName;
                            supplierId = -1;
                        };
                    }
                } else {
                    console.log("$scope.customerQuote.currentSupplierName " + $scope.customerQuote.currentSupplierName);
                    supplierName = $scope.customerQuote.currentSupplierName;
                    supplierId = -1;
                };
                if ($scope.customerQuote.salesPerson != undefined) {
                    if ($scope.customerQuote.salesPerson.key) {
                        salesPerson = $scope.customerQuote.salesPerson.value;
                        salesPersonId = $scope.customerQuote.salesPerson.key;
                    }
                };
                var monthlyAvgPurchase = 0;
                var isNewCustomer = 'no';
                if ($scope.isNewCustomer) {
                    monthlyAvgPurchase = $scope.customerQuote.monthlyAvgPurchase;
                    isNewCustomer = 'yes';
                };
                objQuoteBean = {
                    'custCode': $scope.customerQuote.customerCode,
                    'custName': $scope.customerQuote.customerName,
                    'address': $scope.customerQuote.address,
                    'email': $scope.customerQuote.email,
                    'faxNo': $scope.customerQuote.fax,
                    'phone': $scope.customerQuote.phone,
                    'monthlyAvgPurchase': monthlyAvgPurchase.toString(),
                    'isNewCustomer': isNewCustomer,
                    'quoteAttn': $scope.customerQuote.attn,
                    'currentSupplierName': supplierName,
                    'currentSupplierId': supplierId,
                    'createdDate': moment($scope.customerQuote.createdDate).format('YYYY-MM-DD HH:mm:ss'),
                    'competeQuote': $scope.customerQuote.competeQuote,
                    'salesPerson': salesPerson,
                    'salesPersonId': salesPersonId,
                    'pricesGstInclude': $scope.customerQuote.pricesGstInclude,
                    // 'notes': $scope.customerQuote.notes,
                    'userId': $rootScope.userData.userId,
                }
                return angular.toJson(objQuoteBean);;
            };
            $scope.resetCustomerInfo = function () {
                $scope.customerQuote = {};
                $scope.customerQuote = { 'competeQuote': "No" };
                $scope.customerQuote.createdDate = $scope.today();
                $scope.form.addCustomerQuote.submitted = false;
                $scope.form.addCustomerQuote.$setPristine();
                setUserAsSalesPerson();
            };

            $scope.generateProposal = function () {
                console.log($scope.form);
                console.log($scope.customerQuote)
                if ($scope.form.addCustomerQuote.$valid) {
                    console.log("valid customer info");
                    // $scope.showGenerateConfirmationWindow();
                    $rootScope.showSpinner();
                    SQQuoteServices.GenerateProposal(logoFile, $scope.jsonToGenerateQuote());
                } else {
                    console.log("invalid customer info");
                    $scope.form.addCustomerQuote.submitted = true;
                }
            };
            //CREATE QUOTE RESPONSE >>>>>
            function checkQuoteResponse(quoteResponse) {
                console.log("checkQuoteResponse" + quoteResponse);
                if (quoteResponse) {
                    if (quoteResponse.newCustomerCreated) {
                        var obj = { "code": $scope.customerQuote.customerCode, "key": quoteResponse.genratedCustomerId, "value": $scope.customerQuote.customerCode + " (" + $scope.customerQuote.customerName + ")" };
                        ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.customerList, obj);
                    }
                    if (quoteResponse.newSupplierCreated) {
                        var obj = { "code": supplierName, "key": quoteResponse.genratedSupplierId, "value": supplierName };
                        ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.supplierList, obj);
                    }
                    // if (quoteResponse.newProductCreated) {
                    //     $rootScope.initAuotoComplete(true);
                    //     $timeout(function() {
                    //     $scope.moveToCustomerInfo();
                    //     }, 2000);
                    // };
                };
            };

            var createQuoteResponse = {};
            $scope.handleGenerateProposalDoneResponse = function (data) {
                createQuoteResponse = {};
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            console.log("Proposal Response ::")
                            console.log(angular.toJson(data));
                            createQuoteResponse = data;
                            checkQuoteResponse(createQuoteResponse);
                            $scope.customerQuote.quoteId = data.genratedProposalId;
                            $scope.isProposalGenerated = true;
                            if ($scope.isProposalGenerated) {
                                $scope.openMyModal();
                            }
                            $rootScope.hideSpinner();
                        } else {
                            $rootScope.alertError(data.message);
                            $rootScope.hideSpinner();
                        }
                    }
                }
            };
            var cleanupEventQuoteSessionTimeOut = $scope.$on("QuoteSessionTimeOut", function (event, message) {
                // $scope.resetCreateQuote();
                $rootScope.$broadcast('SessionTimeOut', message);
                $rootScope.alertSessionTimeOutOnQuote();
            });

            var cleanupEventGenerateProposalDone = $scope.$on("GenerateProposalDone", function (event, message) {
                $scope.handleGenerateProposalDoneResponse(message);
            });

            var cleanupEventGenerateProposalNotDone = $scope.$on("GenerateProposalNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });
            //===== ADD PRODUCT UIB MODAL >>>>>
            $scope.animationsEnabled = true;
            $scope.openMyModal = function (product, index) {
                var modalInstance1 = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    backdrop: "static",
                    keyboard: false,
                    templateUrl: 'addProductModal.html',
                    size: 'lg',
                    controller: 'SQAddProductModalController',
                    resolve: {
                        dataToModal: function () {
                            var dataToModal
                            if ($scope.productButtonStatus == 'add') {
                                dataToModal = {
                                    'quoteStatus': 'create',
                                    'productButtonStatus': $scope.productButtonStatus,
                                    'customerQuote': $scope.customerQuote,
                                    'productGroupList': $scope.productGroupList,
                                    'isAddProductModalShow': $scope.isAddProductModalShow,
                                    // 'addedProductCount': $scope.addedProductCount
                                }
                            } else if ($scope.productButtonStatus == 'edit') {
                                console.log("editProduct")
                                console.log(product)
                                dataToModal = {
                                    'quoteStatus': 'create',
                                    'productButtonStatus': $scope.productButtonStatus,
                                    'customerQuote': $scope.customerQuote,
                                    'productGroupList': $scope.productGroupList,
                                    'isAddProductModalShow': $scope.isAddProductModalShow,
                                    'product': $scope.editProduct,
                                    // 'addedProductCount': $scope.addedProductCount
                                }
                            }
                            return dataToModal
                        }
                    }
                });
                modalInstance1.result.then(function (dataFromModal) {
                    if (dataFromModal.addNextProduct.toLowerCase() == "addnextproduct") {
                    } else if (dataFromModal.addNextProduct.toLowerCase() == "saveclose") {
                        $rootScope.addProductToQuote(dataFromModal);
                        $scope.isAddProductModalShow = false;
                    } else if (dataFromModal.addNextProduct.toLowerCase() == "sessiontimeout") {
                        console.log("Session time out create quote >>")
                        $scope.isAddProductModalShow = false;
                        $scope.createQuote();
                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                    $scope.isAddProductModalShow = false;
                });
            };
            //===== ADD PRODUCT UIB MODAL <<<<<
            // ======= Quote Calculations >>>>>
            $scope.getPriceInPercentage = function (price, cost) {
                var val;
                val = ((price - cost) / price) * 100;
                return val.toFixed(2);
            };

            $scope.supplierInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
            $scope.getSupplierInformation = function () {
                $scope.supplierInformation = CalculationFactory.getSupplierInformation($scope.customerQuote);
            };

            $scope.gpInformation = { 'avgGpRequired': 0, 'avgCurrentSupplierGp': 0 };
            $scope.getGpInformation = function () {
                $scope.gpInformation = CalculationFactory.getGpInformation($scope.customerQuote);
            };

            $scope.totalInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
            $scope.getTotalInformation = function () {
                $scope.totalInformation = CalculationFactory.getTotalInformation($scope.customerQuote);
            };


            $scope.calculateAllInformation = function () {
                // console.log("calculateAllInformation");
                $scope.getSupplierInformation();
                $scope.getGpInformation();
                $scope.getTotalInformation();
                $scope.calculateAlternativeProductsInformation();
            };

            //===========================
            $scope.altSupplierInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
            $scope.getAltSupplierInformation = function () {
                $scope.altSupplierInformation = CalculationFactory.getAltSupplierInformation($scope.customerQuote);
            };

            $scope.altGpInformation = { 'avgGpRequired': 0, 'avgCurrentSupplierGp': 0 };
            $scope.getAltGpInformation = function () {
                $scope.altGpInformation = CalculationFactory.getAltGpInformation($scope.customerQuote);
            };

            $scope.altTotalInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
            $scope.getAltTotalInformation = function () {
                // console.log("getAltTotalInformation")
                $scope.altTotalInformation = CalculationFactory.getAltTotalInformation($scope.customerQuote);
            };
            $scope.calculateAlternativeProductsInformation = function () {
                // console.log("calculateAlternativeProductsInformation")
                $scope.getAltSupplierInformation();
                $scope.getAltGpInformation();
                $scope.getAltTotalInformation();
            };
            $scope.checkAlternativeAdded = function () {
                var count = 0;
                $rootScope.addedProductCount = 0;
                if ($scope.customerQuote.productList.length > 0) {
                    angular.forEach($scope.customerQuote.productList, function (value, key) {
                        if (value.altProd) {
                            if (value.altProd.itemCode) {
                                count++;
                                $rootScope.addedProductCount = $rootScope.addedProductCount + 2;
                            }
                        } else {
                            $rootScope.addedProductCount++;
                        }
                    });
                }
                if (count > 0) {
                    $scope.isAlternateAdded = true;
                    $scope.customerQuote.saveWithAlternative = true;
                } else {
                    $scope.isAlternateAdded = false;
                }
            };
            // ======= Quote Calculations <<<<<
            //===== ADD PRODUCT INTO QUOTE >>>>>
            $scope.showConfirmationWindowOnGenerateProposal=function(){
                var previousWindowKeyDown = window.onkeydown;
                  swal({
                  title: 'Please Confirm Customer Information',
                  text: "After confirmation user will be able to edit customer information from View/Edit proposal. ",
                  showCancelButton: true,
                  closeOnConfirm: true,
                  cancelButtonText:"Cancel",
                  confirmButtonText:"Confirm"
                  }, function (isConfirm) {
                    if (isConfirm) {
                    //   $scope.resetCurrentSupplier();
                      $scope.generateProposal();
                    }
                  });
            };

            $scope.productsDataset = [];
            var editProduct = {};
            $scope.showAddProductModal = function (status, product, index) {
                // console.log(product);
                if ($scope.form.addCustomerQuote.$valid) {
                    $scope.productButtonStatus = status;
                    $scope.isAddProductModalShow = true;
                    // console.log($scope.productButtonStatus + " product >>>>")
                    if ($scope.productButtonStatus == 'add') {
                        if ($scope.isProposalGenerated) {
                            $scope.openMyModal();
                        } else {
                            $scope.showConfirmationWindowOnGenerateProposal();
                        }
                    } else if ($scope.productButtonStatus == 'edit') {
                        $scope.editProduct = angular.copy(product);
                        $scope.editIndex = index;
                        $scope.openMyModal();
                    }
                } else {
                    $scope.form.addCustomerQuote.submitted = true;
                }
            };
            $scope.checkProduct = function (dataFromModal) {
                // console.log("checkProduct...")
                $scope.dataFromModal = angular.copy(dataFromModal);
                $scope.addProduct = dataFromModal.addProduct;
                $scope.productButtonStatus = dataFromModal.productButtonStatus;
                $scope.isNewProduct = dataFromModal.isNewProduct;
                var product;
                var altProduct;
                product = angular.copy($scope.addProduct);

                if (product) {
                    if (product.currentSupplierPrice > 0 && product.quotePrice > 0) {//product.currentSupplierPrice>product.quotePrice
                        if (product.currentSupplierPrice == product.quotePrice) {
                            product.savings = 0;
                        } else {
                            product.savings = $scope.getPriceInPercentage(product.currentSupplierPrice, product.quotePrice);
                        }
                    } else {
                        product.savings = 0;
                    }
                    if (product.currentSupplierPrice > 0) {
                        product.currentSupplierGP = $scope.getPriceInPercentage(product.currentSupplierPrice, product.avgcost);
                    } else {
                        product.currentSupplierGP = 0;
                        product.currentSupplierPrice = 0;
                    }
                    product.total = product.itemQty * product.quotePrice;
                    product.currentSupplierTotal = product.itemQty * product.currentSupplierPrice;
                    product.gpRequired = $scope.getPriceInPercentage(product.quotePrice, product.avgcost);
                }
                if (product.isLinkedExact) {
                    if (product.altProd != null) {
                        if (product.altProd.currentSupplierPrice > 0 && product.altProd.quotePrice > 0) {//product.altProd.currentSupplierPrice>product.altProd.quotePrice
                            if (product.altProd.currentSupplierPrice == product.altProd.quotePrice) {
                                product.altProd.savings = 0;
                            } else {
                                product.altProd.savings = $scope.getPriceInPercentage(product.altProd.currentSupplierPrice, product.altProd.quotePrice);
                            }
                        } else {
                            product.savings = 0;
                        }
                        if (product.altProd.currentSupplierPrice > 0) {
                            product.altProd.currentSupplierGP = $scope.getPriceInPercentage(product.altProd.currentSupplierPrice, product.altProd.avgcost);
                        } else {
                            product.altProd.currentSupplierGP = 0;
                            product.altProd.currentSupplierPrice = 0;
                        }
                        product.altProd.total = product.altProd.itemQty * product.altProd.quotePrice;
                        product.altProd.currentSupplierTotal = product.altProd.itemQty * product.altProd.currentSupplierPrice;
                        product.altProd.gpRequired = $scope.getPriceInPercentage(product.altProd.quotePrice, product.altProd.avgcost);
                    }
                }
                var newProduct;
                if ($scope.isNewProduct) {
                    // console.log("new product.....")
                    newProduct = {
                        'itemCode': product.itemCode,
                        'itemDescription': product.itemDescription,
                        'productGroupCode': product.productGroup.code,
                        'unit': product.unit,
                        'avgcost': product.avgcost,
                        'itemQty': product.itemQty,
                        'currentSupplierPrice': product.currentSupplierPrice,
                        'currentSupplierTotal': product.currentSupplierTotal,
                        'currentSupplierGP': product.currentSupplierGP,
                        'quotePrice': product.quotePrice,
                        'total': product.total,
                        'gpRequired': product.gpRequired,
                        'savings': product.savings,
                        'isNewProduct': $scope.isNewProduct,
                        'gstFlag': product.gstFlag,
                        'isLinkedExact': product.isLinkedExact,
                        'lineComment': product.lineComment,
                        'isAlternative': 'no'
                    };
                    if (product.isLinkedExact) {
                        newProduct.altProd = product.altProd;
                    }
                    console.log(newProduct)
                    product = angular.copy(newProduct);
                } else {
                    // console.log("existing product>>>>>");
                    if (product) {
                        product.isNewProduct = $scope.isNewProduct;
                    }
                }
                product.quoteId = $scope.customerQuote.quoteId;
                return product;
            }
            var productToPush, productToSend;
            $rootScope.addProductToQuote = function (dataFromModal) {
                // console.log("addProductToQuote create...");
                // console.log($scope.checkProduct(dataFromModal));
                productToPush = $scope.checkProduct(dataFromModal);
                productToSend = angular.copy(productToPush);
                if ($scope.productButtonStatus == 'add') {
                    productToSend.alternativeProductList = [];
                    console.log("add product--------")
                    $rootScope.showSpinner();
                    SQQuoteServices.AddProductToProposal(angular.toJson(productToSend));
                };
                if ($scope.productButtonStatus == 'edit') {
                    productToSend.alternativeProductList = [];
                    console.log("edit product--------")
                    $rootScope.showSpinner();
                    SQQuoteServices.EditProductIntoProposal(angular.toJson(productToSend));
                };
                // console.log("$scope.customerQuote.productList")
                // console.log($scope.customerQuote.productList)
                $scope.showAddProductError = false;
            };

            $scope.deleteProductFromQuote = function (index) {
                console.log($scope.addedProductList[index]);
                $scope.deleteIndex = index;
                var productToDelete = angular.copy($scope.addedProductList[index])
                var previousWindowKeyDown = window.onkeydown;
                swal({
                    title: 'Confirm Navigation',
                    text: "Are you sure you want to delete product ?",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    cancelButtonText: "Cancel",
                    confirmButtonText: "Confirm"
                }, function (isConfirm) {
                    if (isConfirm) {
                        if ($scope.addedProductList.length > 0) {
                            $rootScope.showSpinner();
                            SQQuoteServices.DeleteProductFromProposal(angular.toJson(productToDelete));
                        }
                    }
                });
            };

            $scope.handleAddProductToProposalDoneResponse = function (data) {
                if (data) {
                    console.log(data)
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            if (data.quoteDetailIdMain) {
                                productToPush.quoteDetailId = data.quoteDetailIdMain;
                            }
                            if (data.quoteDeatilIdAlt) {
                                productToPush.altProd.quoteDetailId = data.quoteDeatilIdAlt;
                            }
                            if (data.newProductCreated) {
                                $scope.isNewProductCreatedByQuote = true;
                            }
                            // console.log(productToPush);
                            $scope.addedProductList.push(productToPush);
                            $scope.customerQuote.productList = $scope.addedProductList;
                            $scope.calculateAllInformation();
                            $scope.checkAlternativeAdded();
                            $rootScope.hideSpinner();
                        }
                    }
                }
            };
            var cleanupEventAddProductToProposalDone = $scope.$on("AddProductToProposalDone", function (event, message) {
                $scope.handleAddProductToProposalDoneResponse(message);
            });

            var cleanupEventAddProductToProposalNotDone = $scope.$on("AddProductToProposalNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });
            //=======================================================================
            $scope.handleEditProductIntoProposalDoneResponse = function (data) {
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            console.log(data);
                            $scope.addedProductList[$scope.editIndex] = productToPush;
                            $scope.customerQuote.productList = $scope.addedProductList;
                            $scope.calculateAllInformation();
                            $scope.checkAlternativeAdded();
                            $rootScope.hideSpinner();
                        }
                    }
                }
            };
            var cleanupEventEditProductIntoProposalDone = $scope.$on("EditProductIntoProposalDone", function (event, message) {
                $scope.handleEditProductIntoProposalDoneResponse(message);
            });

            var cleanupEventEditProductIntoProposalNotDone = $scope.$on("EditProductIntoProposalNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });
            //=======================================================================

            $scope.handleDeleteProductFromProposalDoneResponse = function (data) {
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            $scope.addedProductList.splice($scope.deleteIndex, 1);
                            $scope.customerQuote.productList = $scope.addedProductList;
                            $scope.calculateAllInformation();
                            $scope.checkAlternativeAdded();
                            $rootScope.hideSpinner();
                        }
                    }
                }
            };
            var cleanupEventDeleteProductFromProposalDone = $scope.$on("DeleteProductFromProposalDone", function (event, message) {
                $scope.handleDeleteProductFromProposalDoneResponse(message);
            });

            var cleanupEventDeleteProductFromProposalNotDone = $scope.$on("DeleteProductFromProposalNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });

            //=================== Save Generated Proposal ==================== 
            $scope.jsonToSaveProposal = function () {
                var objQuoteBean = {};
                var isNewProductAdded= "NO";
                if($scope.isNewProductCreatedByQuote){
                    isNewProductAdded="YES";
                }
                objQuoteBean = {
                    'quoteId': $scope.customerQuote.quoteId,
                    'notes': $scope.customerQuote.notes,
                    'termConditionList': $scope.termConditionArray,
                    'offerList': $scope.offerArray,
                    'userId': $rootScope.userData.userId,
                    'isNewProductAdded': isNewProductAdded,
                }
                return objQuoteBean;
            }
            //===== JSON FOR QUOTE <<<<<
            $scope.saveGeneratedProposal = function () {
                $log.debug("saveGeneratedProposal call");
                if ($scope.form.addCustomerQuote.$valid) {
                    if ($scope.customerQuote.productList.length > 0) {
                        $rootScope.showSpinner();
                        SQQuoteServices.SaveGeneratedProposal(angular.toJson($scope.jsonToSaveProposal()));
                    } else {
                        $log.debug("please add products");
                        $scope.showAddProductError = true;
                        $rootScope.alertServerError("Please add products to create proposal.");
                        $('#addProductBtn').focus();
                    }
                } else {
                    $log.debug("invalid form");
                    $rootScope.moveToTop();
                    $scope.form.addCustomerQuote.submitted = true;
                }
            };

            //CREATE QUOTE RESPONSE >>>>>
            function checkSaveQuoteResponse(quoteResponse) {
                console.log("checkQuoteResponse");
                console.log(quoteResponse)
                if (quoteResponse) {
                    if (quoteResponse.newProductCreated) {
                        $rootScope.initAuotoComplete(true);
                        $timeout(function () {
                            $scope.moveToCustomerInfo();
                        }, 2000);
                    };
                };
            };
            var saveQuoteResponse = {};
            $scope.handleSaveGeneratedProposalDoneResponse = function (data) {
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            saveQuoteResponse = data;
                            checkSaveQuoteResponse(saveQuoteResponse);
                            $scope.resetCreateQuote();
                            var previousWindowKeyDown = window.onkeydown;
                            swal({
                                title: "Success",
                                text: "Successfully created proposal...!",
                                type: "success",
                                timer: 2000,
                                showConfirmButton: false
                                // closeOnConfirm: true,			
                            });
                            if (!data.newProductCreated) {
                                $rootScope.hideSpinner();
                                $timeout(function () {
                                    $scope.moveToCustomerInfo();
                                }, 2000);
                            };
                            // $rootScope.hideSpinner();
                        } else {
                            $rootScope.alertError(data.message);
                            $rootScope.hideSpinner();
                        }
                    }
                }
            };
            var cleanupEventSaveGeneratedProposalDone = $scope.$on("SaveGeneratedProposalDone", function (event, message) {
                $scope.handleSaveGeneratedProposalDoneResponse(message);
            });

            var cleanupEventSaveGeneratedProposalNotDone = $scope.$on("SaveGeneratedProposalNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });

            $scope.cancelGeneratedProposal = function () {
                // $scope.showRestoreQuoteView = false;
                $log.debug("cancelGeneratedProposal call");
                $scope.isProposalGenerated = false;
                $scope.customerQuote = {};
                $scope.customerQuote.productList = {};
                $scope.customerQuote.productList = [];
                $scope.addedProductList = [];
                $scope.isAddProductModalShow = false;
                $scope.supplierInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
                $scope.totalInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
                $scope.gpInformation = { 'avgGpRequired': 0, 'avgCurrentSupplierGp': 0 };
                $scope.altSupplierInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
                $scope.altTotalInformation = { 'subtotal': 0, 'gstTotal': 0, 'total': 0 };
                $scope.altGpInformation = { 'avgGpRequired': 0, 'avgCurrentSupplierGp': 0 };
                isSupplierExist = false;
                $scope.isNewCustomer = false;
                $scope.customerQuote.competeQuote = "No";
                $scope.isAlternateAdded = false;
                $scope.customerQuote.saveWithAlternative = false;
                $scope.showAddProductError = false;
                $scope.form.addCustomerQuote.submitted = false;
                $scope.form.addCustomerQuote.$setPristine();
                $rootScope.addedProductCount = 0;
                setUserAsSalesPerson();//
                $scope.initDate();
                $scope.moveToCustomerInfo();

            };
            //===================HOTKEYS====================  
            hotkeys.bindTo($scope)
                .add({
                    combo: 'ctrl+shift+a',
                    description: 'Show / hide add product pop-up',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function () {
                        console.log("isAddProductModalShow");
                        console.log($scope.isAddProductModalShow)
                        if (!$scope.isAddProductModalShow) {
                            $scope.showAddProductModal('add')
                        } else {
                            $rootScope.closeModal();
                        }
                    }
                });

            hotkeys.bindTo($scope)
                .add({
                    combo: 'ctrl+shift+z',
                    description: 'Add Next Product',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function () {
                        console.log("add next product");
                        console.log($scope.isAddProductModalShow);
                        if ($scope.isAddProductModalShow) {
                            $rootScope.addNextProduct();
                        }

                    }
                });

            hotkeys.bindTo($scope)
                .add({
                    combo: 'ctrl+shift+s',
                    description: 'Save Quote / Save & Close Product',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function () {
                        console.log("Save");
                        console.log($scope.isAddProductModalShow);
                        if ($scope.isAddProductModalShow) {
                            $rootScope.saveAndClose();
                        } else {
                            // $scope.createQuote();
                        }
                    }
                });

            $scope.$on('$destroy', function (event, message) {
                cleanupEventGetCustomerDetailsDone();
                cleanupEventGetCustomerDetailsNotDone();
                cleanupEventGetProductGroupListDone();
                cleanupEventGetProductGroupListNotDone();
                cleanupEventGenerateProposalDone();
                cleanupEventGenerateProposalNotDone();
                cleanupEventAddProductToProposalDone();
                cleanupEventAddProductToProposalNotDone();
                cleanupEventEditProductIntoProposalDone();
                cleanupEventEditProductIntoProposalNotDone();
                cleanupEventDeleteProductFromProposalDone();
                cleanupEventDeleteProductFromProposalNotDone();
                cleanupEventSaveGeneratedProposalDone();
                cleanupEventSaveGeneratedProposalNotDone();
                $rootScope.isQuoteActivated = false;
            });
        });

        // var currentQuote = {
        //     "customerCode":quote.custCode,
        //     "customerName":quote.custName,
        //     "address":quote.address,
        //     "alternativeArray":quote.alternativeArray,
        //     "commentList":quote.commentList,
        //     "competeQuote":quote.competeQuote,
        //     "createdDate":quote.createdDate,
        //     "currentSupplierId":quote.currentSupplierId,
        //     "currentSupplierName":quote.currentSupplierName,
        //     "custLogo":quote.custLogo,
        //     "email":quote.email,
        //     "faxNo":quote.fax,
        //     "isNewCustomer":quote.isNewCustomer,
        //     "modifiedDate":quote.modifiedDate,
        //     "monthlyAvgPurchase":quote.monthlyAvgPurchase,
        //     "notes":quote.notes,
        //     "offerList":quote.offerList,
        //     "phone":quote.phone,
        //     "pricesGstInclude":quote.pricesGstInclude,
        //     "productList":quote.productList,
        //     "quoteAttn":quote.quoteAttn,
        //     "quoteId":quote.quoteId,
        //     "salesPerson":quote.salesPerson,
        //     "salesPersonId":quote.salesPersonId,
        //     "saveWithAlternative":quote.saveWithAlternative,
        //     "serviceList":quote.serviceList,
        //     "status":quote.status,
        //     "termConditionList":quote.termConditionList,
        //     "userId":quote.userId
        // };