angular.module('sq.SmartQuoteDesktop')
    .controller('SQRestoreQuoteConroller',
        function ($controller, $uibModal, $scope, $rootScope, $window, $anchorScroll, $log, $state, $timeout, SQManageMenuServices, hotkeys, $http, SQQuoteServices, CalculationFactory, ArrayOperationFactory, DTOptionsBuilder, DTColumnDefBuilder) {
            console.log('initialise SQRestoreQuoteConroller');
            $scope.restoreView = true;
            //===================================================================
            //------------------- Restore Proposal List Code---------------------
            //===================================================================

            $scope.getGeneratedQuoteList = function () {
                $rootScope.showSpinner();
                SQQuoteServices.GetGeneratedQuoteList();
            };

            $scope.arrangeDataTable = function () {
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('order', [0, 'desc']);
                $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1).withOption("type", "date-au"),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5),
                DTColumnDefBuilder.newColumnDef(6),
                DTColumnDefBuilder.newColumnDef(7),
                DTColumnDefBuilder.newColumnDef(8).withOption("type", "date-close"),,
                DTColumnDefBuilder.newColumnDef(9), 
            
                ];
            };

            $scope.handleGetGeneratedQuoteListDoneResponse = function (data) {
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            console.log(data);
                            $scope.quoteListView = data.result;
                            $scope.arrangeDataTable();
                            $scope.getProductGroup();
                            // $rootScope.hideSpinner();
                        } else {
                            $rootScope.alertError(data.message);
                            $rootScope.hideSpinner();
                        }
                    }
                }
            };
            var cleanupEventGetGeneratedQuoteListDone = $scope.$on("GetGeneratedQuoteListDone", function (event, message) {
                $scope.handleGetGeneratedQuoteListDoneResponse(message);
            });

            var cleanupEventGetGeneratedQuoteListNotDone = $scope.$on("GetGeneratedQuoteListNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });
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
                            // $rootScope.isQuoteActivated = true;
                            $rootScope.hideSpinner();
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
            $scope.$on("setUpdatedUserDataDone", function (event, message) {
                console.log("setUpdatedUserDataDone")
                if (message.toLowerCase() == "success") {
                    $scope.currentSupplierList = angular.copy($rootScope.supplierList);
                    $scope.termConditionArray = angular.copy($rootScope.termConditionList);
                    $scope.serviceArray = angular.copy($rootScope.serviceList);
                    $scope.offerArray = angular.copy($rootScope.offerList);
                }
            });

            //--------------------------------------------------------------------------------------------
            $scope.initRestoreView = function () {
                $scope.getGeneratedQuoteList();
            };
            $scope.initRestoreView();
            //--------------------------------------------------------------------------------------------
            $scope.cancelGeneratedProposal = function () {
                $scope.showRestoreQuoteView = false;
                $scope.isSaveAndPrintInitiated = false;
            };
            $scope.viewRestoreProposal = function (proposal) {
                if (proposal) {
                    console.log(proposal);
                    $rootScope.showSpinner();
                    SQQuoteServices.GetGeneratedQuoteView(proposal.quoteId);
                }
            };

            $scope.handleGetGeneratedQuoteViewDoneResponse = function (data) {
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            console.log(data);
                            $scope.proposalInfo = angular.copy(data.quoteInfo);
                            $scope.showRestoreQuoteView = true;
                            $scope.setDetailInformation($scope.proposalInfo);
                            $rootScope.hideSpinner();
                            // $rootScope.$broadcast('GetGeneratedQuoteViewToRestore', $scope.proposal);
                        } else {
                            $rootScope.alertError(data.message);
                            $rootScope.hideSpinner();
                        }
                    }
                }
            };

            var cleanupEventGetGeneratedQuoteViewDone = $scope.$on("GetGeneratedQuoteViewDone", function (event, message) {
                $scope.handleGetGeneratedQuoteViewDoneResponse(message);
            });

            var cleanupEventGetGeneratedQuoteViewNotDone = $scope.$on("GetGeneratedQuoteViewNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });
            //------------------------------------------------------
            $scope.getProductsListArray = function (productList) {
                var list = [];
                if (productList.length > 0) {
                    angular.forEach(productList, function (product, key) {
                        // console.log("looop... "+key)
                        if (product.isAlternative != null) {
                            if (product.isAlternative.toUpperCase() == "YES" && key > 0) {
                                // console.log("product.isAlternative "+product.isAlternative.toUpperCase())
                                if (product.altForQuoteDetailId > 0) {
                                    angular.forEach(list, function (listProd, key) {
                                        if (listProd.quoteDetailId == product.altForQuoteDetailId) {
                                            var altProd = product;
                                            listProd.altProd = angular.copy(altProd);
                                            listProd.isLinkedExact = true
                                        }
                                    });
                                }
                            } else {
                                list.push(product);
                            }
                        } else {
                            list.push(product);
                        }
                        // console.log(list)
                    });
                }
                return list;
            };

            $rootScope.getDate = function (date) {
                var dt = new Date(date);
                // var fDate = moment(dt).format("DD-MM-YYYY");
                return dt;
            };
            $scope.setDetailInformation = function (quote) {
                console.log("setDetailInformation");
                var currentQuote = angular.copy(quote);
                if (currentQuote.competeQuote.toUpperCase == 'NO') {
                    $scope.isCurrentSupplierNameRequired = false;
                } else if (currentQuote.competeQuote.toUpperCase == 'YES') {
                    $scope.isCurrentSupplierNameRequired = true;
                }
                if (currentQuote.currentSupplierId > 0) {
                    var currentSupplierName = { 'code': currentQuote.currentSupplierName, 'key': currentQuote.currentSupplierId, 'value': currentQuote.currentSupplierName }
                } else {
                    var currentSupplierName = "";
                }
                $scope.isEditViewShow = true;
                currentQuote.currentSupplierName = currentSupplierName;
                console.log(currentQuote);
                $scope.customerQuote = currentQuote;
                $scope.customerQuote.customerCode = currentQuote.custCode;
                $scope.customerQuote.customerName = currentQuote.custName;
                $scope.customerQuote.fax = currentQuote.faxNo;
                $scope.customerQuote.attn = currentQuote.quoteAttn;
                var salesPerson = { 'code': currentQuote.salesPersonId.toString(), 'key': currentQuote.salesPersonId, 'value': currentQuote.salesPerson }
                angular.forEach($scope.userList, function (user, index) {
                    if (user.code) {
                        if (user.code.toUpperCase() == salesPerson.code.toUpperCase() && user.key == salesPerson.key) {
                            $scope.customerQuote.salesPerson = user;
                        }
                    }
                });
                $scope.customerQuote.productList = $scope.getProductsListArray(currentQuote.productList);
                $scope.filepreview = currentQuote.custLogo;
                $scope.customerQuote.createdDate = $scope.getDate(moment(currentQuote.createdDate).format());
                $scope.customerQuote.closeDate = $scope.getDate(moment(currentQuote.closeDate).format());
                // $scope.showProposal = true;
                $scope.isProposalGenerated = true;
                $scope.addedProductList = $scope.customerQuote.productList;
                console.log($scope.customerQuote);
                $scope.calculateAllInformation();
                $scope.checkAlternativeAdded();
                $rootScope.isQuoteActivated=true;
            };

            //===================================================================
            //------------------- Restore Proposal Form Code---------------------
            //===================================================================
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

            //------------------------------------------------------------------
            $scope.dynamicPopover = {
                templateUrl: 'myPopoverTemplate.html',
                title: 'Customer Logo'
            };
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
            $scope.assignAlternatives = function (data) {
                console.log("assignAlternatives")
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            if (data.objProductResponseBean.alternativeProductList) {
                                if (data.objProductResponseBean.alternativeProductList.length > 0) {
                                    $scope.editProduct.alternativeProductList = angular.copy(data.objProductResponseBean.alternativeProductList);
                                }
                            }
                            $scope.openMyModal();
                        }
                    };
                }
                $rootScope.hideSpinner();
            };
            $scope.getEditProductAlternatives = function (productCode) {
                // $rootScope.showLoadSpinner();
                $http({
                    method: "POST",
                    // url: "/getProductDetails?productCode="+productCode,
                    url: $rootScope.projectName + "/getProductDetailsWithAlternatives?productCode=" + productCode,
                }).success(function (data, status, header, config) {
                    console.log(data)
                    if (data.code == "sessionTimeOut") {
                        $rootScope.$broadcast('QuoteSessionTimeOut', data);
                        // $scope.addProductFromModal("sessiontimeout");
                    } else {
                        $scope.assignAlternatives(data);
                    }
                }).error(function (data, status, header, config) {
                    $rootScope.$broadcast('GetProductDetailsNotDone', data);
                });
            }
            //===== ADD PRODUCT INTO QUOTE >>>>>
            $scope.productsDataset = [];
            var editProduct = {};
            $scope.showAddProductModal = function (status, product, index) {
                console.log("showAddProductModal");
                console.log($scope.form.addCustomerQuote.$valid);
                
                if ($scope.form.addCustomerQuote.$valid) {
                    $scope.productButtonStatus = status;
                    $scope.isAddProductModalShow = true;
                    // console.log($scope.productButtonStatus + " product >>>>")
                    if ($scope.productButtonStatus == 'add') {
                        console.log("1.........")
                        if ($scope.isProposalGenerated) {
                            $scope.openMyModal();
                        } else {
                            $scope.generateProposal();
                        }
                    } else if ($scope.productButtonStatus == 'edit') {
                        console.log("2.........")
                        $scope.editProduct = angular.copy(product);
                        $scope.editIndex = index;
                        $rootScope.showSpinner();
                        $scope.getEditProductAlternatives($scope.editProduct.itemCode);
                        // $scope.openMyModal();
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

            $scope.handleAddProductToProposalDoneResponse = function (data) {
                if (data) {
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
                            console.log(productToPush);
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
            $scope.deleteProductFromQuote = function (index) {
                console.log($scope.addedProductList[index]);
                console.log($scope.customerQuote.productList[index]);
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
                    'saveWithAlternative':$scope.customerQuote.saveWithAlternative,
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
             //=================== Save & Print Generated Proposal ====================
            $scope.isSaveAndPrintInitiated=false;
            $scope.saveAsPDF=function(quoteId){
            console.log("saveAsPDF >>");
            var url =$rootScope.projectName+"/custComparison?quoteId="+quoteId;
            console.log(url)
            $window.open(url, '_blank');
            // $window.open(url,'location=1,status=1,scrollbars=1,width=1050,fullscreen=yes,height=1400');
            };

            $scope.saveAndPrintProposal=function(){
                $scope.quoteId=$scope.customerQuote.quoteId;
                $scope.isSaveAndPrintInitiated = true;
                $scope.saveGeneratedProposal();
            };

            function checkSaveQuoteResponse(quoteResponse) {
                console.log("checkQuoteResponse");
                console.log(quoteResponse)
                if (quoteResponse) {
                    if (quoteResponse.newProductCreated) {
                        $rootScope.initAuotoComplete(true);
                    };
                };
            };
            var saveQuoteResponse = {};
            $scope.handleSaveGeneratedProposalDoneResponse = function (data) {
                if (data) {
                    if (data.code) {
                        if (data.code.toUpperCase() == 'SUCCESS') {
                            saveQuoteResponse=data;
                            checkSaveQuoteResponse(saveQuoteResponse);
                            $scope.resetQuote();
                            swal({
                                title: "Success",
                                text: "Successfully restore proposal...!",
                                type: "success",
                              },
                              function(){
                                if($scope.isSaveAndPrintInitiated){
                                    $scope.saveAsPDF($scope.quoteId);
                                };
                                // $rootScope.hideSpinner();
                                // $scope.resetQuote();
                                $scope.cancelGeneratedProposal();
                                $scope.initRestoreView();
                              });
                        } else {
                            $rootScope.alertError(data.message);
                            $rootScope.hideSpinner();
                        }
                    }
                }
            };
            var cleanupEventSaveGeneratedProposalDone = $scope.$on("SaveGeneratedProposalDone", function (event, message) {
                $scope.handleSaveGeneratedProposalDoneResponse(message);
                console.log(message)
            });

            var cleanupEventSaveGeneratedProposalNotDone = $scope.$on("SaveGeneratedProposalNotDone", function (event, message) {
                $rootScope.alertServerError("Server error");
                $rootScope.hideSpinner();
            });

            $scope.resetQuote = function () {
                $log.debug("resetQuote call");
                $scope.isProposalGenerated = false;
                $scope.customerQuote = {};
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
                // $scope.initCreateQuote('init2');
                $rootScope.addedProductCount = 0;
                $scope.isNewProductCreatedByQuote = false;
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
                cleanupEventGetGeneratedQuoteListDone();
                cleanupEventGetGeneratedQuoteListNotDone();
                cleanupEventGetGeneratedQuoteViewDone();
                cleanupEventGetGeneratedQuoteViewNotDone();
                cleanupEventGetProductGroupListDone();
                cleanupEventGetProductGroupListNotDone();
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

