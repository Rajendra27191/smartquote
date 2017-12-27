angular.module('sq.SmartQuoteDesktop')
.controller('SQDashBoardController',function($scope,$rootScope,SQUserHomeServices,$window){
console.log('initialise SQDashBoardController controller');
$window.pageYOffset;


//==================DATE===============
$scope.today = function() {
    $scope.dt = new Date();
    return $scope.dt;
};

$scope.example = {
 value: new Date(2013, 9, 22)
};
$scope.popup1={};
$scope.popup2={};
$scope.buttonstatus='add';
$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = "dd-MM-yyyy";
$scope.dateOptions1 = {
formatYear: 'yy',
startingDay: 1,
showWeeks: false,
maxDate:$scope.today(),
};
$scope.dateOptions2 = {
formatYear: 'yy',
startingDay: 1,
showWeeks: false,
maxDate:$scope.today(),
// minDate: new Date(),
// startingDay: 1
};
$scope.dateValid=true;

$scope.validToDate=function(){
var currentDate=$scope.today();
var toDate=new Date(currentDate.getFullYear()+1,currentDate.getMonth(),currentDate.getDate());
return toDate;
};

$scope.validFromDate=function(){
var currentDate=$scope.today();
var fromDate=new Date(currentDate.getFullYear(),currentDate.getMonth()-1,currentDate.getDate());
return fromDate;
};
$scope.open1 = function() {
$scope.popup1.opened = true;
};
$scope.open2 = function() {
$scope.popup2.opened = true;
};


$scope.validateDate=function(dateFrom,dateTo){
	console.log("validateDate")
	if(dateFrom&&dateTo){
		var date1=moment(dateFrom).format('YYYY-MM-DD');
		var date2=moment(dateTo).format('YYYY-MM-DD');
		if (date2>date1) {
			$scope.dateValid=true;
		}else{
			$scope.dateValid=false;
		}
	}
}
// === INIT
$scope.userID=angular.copy($rootScope.userData.userId);
$scope.agent={};
$scope.agent.fromDate=$scope.validFromDate();
$scope.agent.toDate=$scope.today();
$scope.noDataFound=false;

if ($rootScope.userData) {
  if ($rootScope.userData.userType.toLowerCase()=="admin") {
    $scope.disableSelectAgent=false;
	$scope.agent.agentList=angular.copy($rootScope.userList);
	var obj={"code":"0","key":0,"value":"All Agents"};
	$scope.agent.agentList.unshift(obj);
	$scope.agent.agentCode=$scope.agent.agentList[0]//"0";
	$scope.selectedUserID=$scope.agent.agentCode.code;
  }else{
    $scope.disableSelectAgent=true;
    // $scope.agent.agentCode=$rootScope.userData.userId.toString();
    $scope.selectedUserID=$scope.userID;
	$scope.agent.agentList=angular.copy($rootScope.userList);
	angular.forEach($scope.agent.agentList, function(value, key){
    	if (value.code==$rootScope.userData.userId.toString()) {
    		$scope.agent.agentCode=value;
    	};
    });
    // $scope.agent.agentCode=$scope.agent.agentList[0]
	// var obj={"code":"0","key":0,"value":"All Agents"};
	// $scope.agent.agentList.push(obj);
  }
};


$scope.changeAgent=function(agent){
console.log("changeAgent")
console.log(agent);
$scope.selectedUserID=agent.code;
$scope.selectedUserID=agent.code;
};




$scope.dataToChart=function(){
var chartDetails={};
chartDetails={
	'fromDate':moment($scope.agent.fromDate).format('YYYY-MM-DD'),
	'toDate':moment($scope.agent.toDate).format('YYYY-MM-DD'),
	'userID':$scope.selectedUserID,
}
return angular.toJson(chartDetails);
};
$scope.init=function(){
	$rootScope.showSpinner();
	SQUserHomeServices.GetChartData($scope.dataToChart());
};

// $rootScope.initAuotoComplete();

$scope.init();


//===============Format chart data======
function capitalize(s){
    return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
};

function formatCalloutData(response){
console.log(response);
$scope.callOutData= angular.copy(response);
};
function formatBarChartData(response){
$scope.objBarChart={};
var data=[];
var column=[];
var legend=[];
legend.push('');	
column.push('');
angular.forEach(response, function(value, key){
legend.push(capitalize(value.status));
column.push(value.totalCount);
});
data.push(legend);
data.push(column);
$scope.objBarChart.type="ColumnChart"
$scope.objBarChart.data=data;
console.log($scope.agentData)
$scope.objBarChart.options= {
// title: "Result For "+$scope.agentData.agentCode.value+" From "+$rootScope.getFormattedDate($scope.agentData.fromDate)+" To "+$rootScope.getFormattedDate($scope.agentData.toDate),
// 'legend': {'position': 'top','alignment': 'start' },
'colors': ["#008901","#FF9600","#EC3100"],
vAxis: {
minValue: 0,
// maxValue: 10,
}
};
console.log(angular.toJson($scope.objBarChart))

};
function formatPieChartData(response){
$scope.objPieChart={};
$scope.objPieChart.type="PieChart"
$scope.objPieChart.options= {
        // 'title': 'Proposal',
        // 'legend': {'position': 'none'},
        'colors': ["#008901","#FF9600","#EC3100"]
    };
$scope.objPieChart.data={"cols": [
        {id: "t", label: "Status", type: "string"},
        {id: "s", label: "Status", type: "number"},
        {role: "style", type: "string"}
],"rows":[]};
angular.forEach(response, function(value, key){
var c={};
c={c: [{v: capitalize(value.status)},{v: value.totalCount},]};
$scope.objPieChart.data.rows.push(c);	
});
console.log(angular.toJson($scope.objPieChart))
};


function formatData(response){
$scope.agentData=angular.copy($scope.agent)
formatBarChartData(response);
formatPieChartData(response);

$scope.showDashboard=true;
// $scope.totalStatus=angular.copy(response);
};

$scope.handleGetChartDataDoneResponse=function(data){
	console.log("handleGetChartDataDoneResponse");
	// $scope.showDashboard=false;
	$scope.productDetails={};
	if(data){
		if (data.length>0) {
		var isValidData=false;
		angular.forEach(data,function(value,key){
			if (value.totalCount>0) {
				isValidData=true;
			}
		});	
		if (isValidData) {
		formatCalloutData(data);
		formatData(data);
		$scope.noDataFound=false;
		}else{
			if ($scope.showDashboard) {
			$rootScope.alertError("No Records Found For Agent "+$scope.agent.agentCode.value+"\n From "+$rootScope.getFormattedDate($scope.agent.fromDate)+" To "+ $rootScope.getFormattedDate($scope.agent.toDate));	
			$scope.agent=angular.copy($scope.agentData);
			}else{
			$scope.noDataFound=true;	
			$scope.callOutData1= angular.copy(response);
			};
		}
	}else{
			
		}
	$rootScope.hideSpinner();
}
	// $rootScope.initAuotoComplete();	
};
var cleanupEventGetChartDataDone = $scope.$on("GetChartDataDone", function(event, message){
	$scope.handleGetChartDataDoneResponse(message);      
});

var cleanupEventGetProductDetailsNotDone = $scope.$on("GetChartDataNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
});

//================= Get Dashboard Results=============

$scope.getDashboardResults=function(){
console.log("getDashboardResults");
console.log($scope.agent)
if ($scope.dateValid) {
$scope.init();	
}else{
// $rootScope.SQNotify("Please Select Valid Date",'error'); 
}
};


// $scope.myChartObject = {};
    
//     $scope.myChartObject.type = "ColumnChart";
    
//     $scope.onions = [
//         {v: "Onions"},
//         {v: 3},
//         {v: "#00C851"},
//     ];

//     $scope.myChartObject.data = {"cols": [
//         {id: "t", label: "Proposal", type: "string"},
//         {id: "s", label: "Proposal", type: "number"},
//         {role: "style", type: "string"}
//     ], "rows": [
//         {c: [
//             {v: "Lost"},
//             {v: 20},
//             {v: "#CC0000"}
//         ]},
//         {c: [
//             {v: "Won"},
//             {v: 31},
//             {v: "#007E33"}
//         ]},
//         {c: [
//             {v: "Pipeline"},
//             {v: 15},
//             {v: "#FF8800"}
//         ]},
       
//     ]};

//     $scope.myChartObject.options = {
//         'title': 'Proposal status',
//         // 'legend': {'position': 'none'},
//         'colors': ["#CC0000","#007E33","#FF8800"]

//     };


// var data =[
//           ['', 'Lost','Won','Pipeline'],
//           ['',  15,20,10],
//           // ['Eat',      2],
//           // ['Commute',  2],
//           // ['Watch TV', 2],
//           // ['Sleep',    7]
//         ];

//         var options = {
//           title: 'My Daily Activities',
//           'colors': ["#CC0000","#007E33","#FF8800"]
//             // pieSliceText: 'label',
//         };
//   $scope.myChartObject1={};
//   $scope.myChartObject1.type="ColumnChart";
//   $scope.myChartObject1.data=data;
//   $scope.myChartObject1.options=options;
  

});