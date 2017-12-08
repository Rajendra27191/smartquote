angular.module('sq.SmartQuoteDesktop')
.controller('SQDashBoardController',function($scope,$rootScope,SQUserHomeServices){
console.log('initialise SQDashBoardController controller');
$scope.userArray=$rootScope.userList;
$scope.agent={};
$scope.userID=$rootScope.userData.userId;
$scope.selectedUserID=$scope.userID;



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
$scope.dateOptions = {
formatYear: 'yy',
startingDay: 1,
showWeeks: false
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

$scope.agent={'fromDate':$scope.validFromDate(),'toDate':$scope.today()};

//$scope.today();
$scope.open1 = function() {
$scope.popup1.opened = true;
};
$scope.open2 = function() {
$scope.popup2.opened = true;
};

$scope.fromDateChanged=function(userValidFromDate){
//console.log(userValidFrom)
};
$scope.validateDate=function(dateFrom,dateTo){
	//console.log("validateDate")
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
$scope.init();


//===============Format chart data======
function capitalize(s){
    return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
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
$scope.objBarChart.options= {
title: '',
// 'legend': {'position': 'top','alignment': 'start' },
'colors': ["#CC0000","#FF8800","#007E33"],
vAxis: {
minValue: 0,
maxValue: 10,
}
};
console.log(angular.toJson($scope.objBarChart))

};
function formatPieChartData(response){
$scope.objPieChart={};
$scope.objPieChart.type="PieChart"
$scope.objPieChart.options= {
        'title': '',
        // 'legend': {'position': 'none'},
        'colors': ["#FF8800","#007E33","#CC0000"]
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
formatBarChartData(response);
formatPieChartData(response);
// $scope.totalStatus=angular.copy(response);
};

$scope.handleGetChartDataDoneResponse=function(data){
	console.log("handleGetChartDataDoneResponse")
	$scope.productDetails={};
	if(data){
		if (data.length>0) {
		formatData(data);
		}
	}
	$rootScope.hideSpinner();
};
var cleanupEventGetChartDataDone = $scope.$on("GetChartDataDone", function(event, message){
	$scope.handleGetChartDataDoneResponse(message);      
});

var cleanupEventGetProductDetailsNotDone = $scope.$on("GetChartDataNotDone", function(event, message){
	$rootScope.alertServerError("Server error");
	$rootScope.hideSpinner();
});




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


var data =[
          ['', 'Lost','Won','Pipeline'],
          ['',  15,20,10],
          // ['Eat',      2],
          // ['Commute',  2],
          // ['Watch TV', 2],
          // ['Sleep',    7]
        ];

        var options = {
          title: 'My Daily Activities',
          'colors': ["#CC0000","#007E33","#FF8800"]
            // pieSliceText: 'label',
        };
  $scope.myChartObject1={};
  $scope.myChartObject1.type="ColumnChart";
  $scope.myChartObject1.data=data;
  $scope.myChartObject1.options=options;
  

});