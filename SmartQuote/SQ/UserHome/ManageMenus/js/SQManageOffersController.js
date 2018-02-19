angular.module('sq.SmartQuoteDesktop')
.controller('SQManageOffersController',function($scope,$rootScope,$log,$state,$timeout,SQHomeServices,SQManageMenuServices){
console.log('initialise SQManageOffersController');

$scope.addOfferButtonShow=true;
$scope.saveStatus="add";
$scope.search={};
$scope.filepreview="";
$scope.form={};
$scope.manageOffers={};
var latestFile;
var templateFile;
// $scope.offerList=[];
$scope.imgSrc="";

$scope.dynamicPopover = {
  content: 'Hello, World!',
  templateUrl: 'myPopoverTemplate.html',
  title: 'Title'
};
$scope.imageHover=function(imgSrc){
$scope.imgSrc=imgSrc;
}
//=================Create URL===============
$scope.getTimeStamp=function (){
  var timestamp = new Date().getTime();
  return  timestamp;
}
$scope.getTemplateUrl=function (offerTpl){
var url="";
url=offerTpl+"?"+$scope.getTimeStamp();
return url;
};
$scope.refineOfferList=function(offerList){
var list=[];
var time=$scope.getTimeStamp()
if (offerList.length>0) {
angular.forEach(offerList, function(offer, key){
  if (offer.offerTemplate!="") {
    offer.offerTemplate=offer.offerTemplate+"?"+time;
  }
});
// console.log(offerList);
$rootScope.offerList=offerList;
} 
};
//-------------------- ARRAY OPERATIONS -----------------
$scope.insertIntoArray=function(array,obj){
  array.push(obj);
};
$scope.updateArray=function(array,obj1){
objIndex = array.findIndex((obj => obj.id == obj1.id));
array[objIndex] = obj1;
  // angular.forEach(array, function(element, index){
  // if(element.id==obj.id){
  // array[index]=obj;
  // } 
  // });
};
$scope.deleteFromArray=function(array,obj1){
objIndex = array.findIndex((obj => obj.id == obj1.id));
array.splice(objIndex,1);

//   angular.forEach(array, function(element, index){
//   if(element.id==obj.id&&element.offerName.toUpperCase()==obj.offerName.toUpperCase()){
//   console.log(element)
//   array.splice(index,1);
//   }
// });
};

//-------------------- getOfferList -----------------

// $scope.getOfferList=function(){
// $rootScope.showSpinner();
// SQManageMenuServices.GetOffersList();
// };
// $scope.handleGetOffersListDoneResponse=function(data){
// if(data){
//   if(data.code){
//   if(data.code.toUpperCase()=='SUCCESS'){
//   console.log(data);
//   if (data.result.length>0) {
//     $scope.refineOfferList(data.result);
//   } else{

//   };
//   // $scope.offerList=angular.copy(data.result); 

//   }
//   }
// }
// $rootScope.hideSpinner();
// };

// var cleanupEventGetOffersListDone = $scope.$on("GetOffersListDone", function(event, message){
// $scope.handleGetOffersListDoneResponse(message);
// });

// var cleanupEventSaveDataWithFileNotDone = $scope.$on("GetOffersListNotDone", function(event, message){
// $rootScope.alertServerError("Server error");
// $rootScope.hideSpinner();
// });

$scope.init=function(){
// $scope.getOfferList();
$scope.refineOfferList($rootScope.offerList)
}
$scope.init();
//==================Reset=============
$scope.reset=function(){
console.log("reset")  
$scope.manageOffers={};
latestFile="";
templateFile="";
document.getElementById('fileOfferTemplate').value = '';
$scope.saveStatus="add";
$scope.isInvalid=false;   
$scope.form.manageOffers.$setPristine(); 
$scope.form.manageOffers.submitted=false;
};
//================== Add Offer=============
$scope.openModal=function(){
  $('#addEditViewModal').modal({ keyboard: false,backdrop: 'static',show: true});
};
$scope.closeModal=function(){
  $('#addEditViewModal').modal('hide');
};
$scope.addOfferButtonClicked=function(){
$scope.filepreview="";
$scope.reset();
$scope.openModal();
};

//==================File Select=============
$scope.onFileSelect = function($files){
console.log("onFileSelect");
if ($files.length>0) {
     for (var i = 0; i < $files.length; i++) {
      //
      if(($files[i].name.split('.').pop() == 'pdf'||$files[i].name.split('.').pop() == 'jpg'||$files[i].name.split('.').pop() == 'jpeg' ||$files[i].name.split('.').pop() == 'gif' || $files[i].name.split('.').pop() == 'png')){
       console.log("valid file");
       latestFile = $files[i];
       $scope.file=latestFile
       console.log("File",latestFile.size+" bytes");
       console.log("File",(latestFile.size / 1024)+" kb");
       console.log("")
        if ((latestFile.size / 1024) <=2048) {//6144 15360 2048
	      templateFile=latestFile;
        $scope.invalidFileSize=false;  
        $scope.isInvalid=false;         
	      }else{
			  console.log("invalid file size");
			  $scope.invalidFileSize=true;
	      }
      }else{
       console.log("invalid file");
       $scope.isInvalid=true;
       $scope.invalidFile=true;
       latestFile = {};
       document.getElementById('fileOfferTemplate').value = '';
       }
   }
}else{
	$scope.isFileNull=true;
  latestFile="";
templateFile="";
document.getElementById('fileOfferTemplate').value = '';
};
};

$scope.jsonToSaveOffer=function(){
 var offerDetail={};    
 offerDetail={
  "offerName":$scope.manageOffers.offer,
  // "offerTemplate":templateFile.name,
 }
 if (templateFile) {
  offerDetail.offerTemplate=templateFile.name;
  }
 if ($scope.saveStatus=='edit') {
  offerDetail.id=$scope.manageOffers.id;
 }
 return JSON.stringify(offerDetail);
};

$scope.saveOffer=function(){
console.log("saveOffer")
if ($scope.form.manageOffers.$valid) {
		$log.debug("valid form");
    var formData= new FormData();
    if ($scope.saveStatus=='add') {
    var uploadUrl=$rootScope.projectName+"/createOffer";
    if(templateFile){
    console.log(templateFile)
    formData.append('templateFile',templateFile);
    formData.append('offerDetail',$scope.jsonToSaveOffer());
    $rootScope.showSpinner();
    SQManageMenuServices.SaveDataWithFile(uploadUrl,formData);
    }else{
       $scope.isInvalid=true;    
    }
    } else{
    var uploadUrl=$rootScope.projectName+"/updateOffer";
    if(templateFile){
    console.log(templateFile)
    formData.append('templateFile',templateFile);    
    }
    formData.append('offerDetail',$scope.jsonToSaveOffer());
    $rootScope.showSpinner();
    SQManageMenuServices.SaveDataWithFile(uploadUrl,formData);
    };    
    
	}else{
		$log.debug("invalid form");
		$scope.form.manageOffers.submitted=true;
	}
};

$scope.handleSaveDataWithFileDoneResponse=function(data){
if(data){
  if(data.code){
  if(data.code.toUpperCase()=='SUCCESS'){
  console.log(data);
  $scope.closeModal();
  var obj={};
  obj={"id":data.genratedId,"offerName":$scope.manageOffers.offer,"offerTemplate":data.genratedUrl}
  console.log("ResponseObject")
  console.log(obj)
  if ($scope.saveStatus=='add') {
  $scope.insertIntoArray($rootScope.offerList,obj)
  }else{
  $scope.updateArray($rootScope.offerList,obj) 
  }
  // console.log("ARRAY :: ")
  // console.log(JSON.stringify($rootScope.offerList))
  $rootScope.alertSuccess(data.message);
  $scope.init();
  $scope.reset();
  }else{
  $rootScope.alertError(data.message);
  }
  }
}
$rootScope.hideSpinner();
};
var cleanupEventSaveDataWithFileDone = $scope.$on("SaveDataWithFileDone", function(event, message){
$scope.handleSaveDataWithFileDoneResponse(message);
});

var cleanupEventSaveDataWithFileNotDone = $scope.$on("SaveDataWithFileNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});


//=========== CODE TO DELETE===============
var deleteOfferObj={};
$scope.deleteOffer=function(offer){
  deleteOfferObj={};
  if (offer.id && offer.offerName) {
  var previousWindowKeyDown = window.onkeydown;
  swal({
  title: 'Are you sure?',
  text: "You will not be able to recover this offer!",
  showCancelButton: true,
  closeOnConfirm: false,
  }, function (isConfirm) {
  window.onkeydown = previousWindowKeyDown;
  if (isConfirm) {
    $rootScope.showSpinner();
    SQManageMenuServices.DeleteOffer(offer.id);
    deleteOfferObj={"id":offer.id,"offerName":offer.offerName,"offerTemplate":offer.offerTemplate}
  } 
  });
  }else{

  }
}

$scope.handleDeleteOfferDoneResponse=function(data){
console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
    $scope.deleteFromArray($rootScope.offerList,deleteOfferObj);
    swal({
    title: "Success",
    text: "Successfully deleted offer!",
    type: "success",
    // animation: "slide-from-top",
  },
  function(){
  $scope.init();
  });
}else if (data.code.toUpperCase()=='ERROR'){
   $rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventDeleteOfferDone = $scope.$on("DeleteOfferDone", function(event, message){
$scope.handleDeleteOfferDoneResponse(message);      
});

var cleanupEventDeleteOfferNotDone = $scope.$on("DeleteOfferNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
//=================Edit Offer====================

$scope.editOfferButtonClicked=function(offer){
if (offer) {
  $scope.openModal();
  $scope.saveStatus='edit';
  $scope.manageOffers.offer=offer.offerName;
  $scope.manageOffers.id=offer.id;
  $scope.filepreview=$scope.getTemplateUrl(offer.offerTemplate);
};
};

$scope.$on('$destroy', function(event, message) {
  cleanupEventSaveDataWithFileDone();
  cleanupEventSaveDataWithFileNotDone();
  cleanupEventDeleteOfferDone();
  cleanupEventDeleteOfferNotDone();
});










});
