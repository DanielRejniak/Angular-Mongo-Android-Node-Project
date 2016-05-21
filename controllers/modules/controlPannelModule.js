var app = angular.module('controlPannelModule', ['ngRoute']);

app.controller('controlPannelCtrl', function($scope, $http, $location, $rootScope) {

    //Count The Amount Of Events Created By Current User
    $http.get('/countMyEvents').success(function(data) {
        $scope.test = data;
    });

    //Count The Amount Of Active Events Created By Current User
        $http.get('/countMyActiveEvents').success(function(data) {
        $scope.test1 = data;
    });

    //Count The Amount Of Messages
    $http.get('/countMyMessages').success(function(data) {
        $scope.test2 = data;
    });

    //Display Event That Belong To Logged In User
        $http.get('/displayMyEvents').success(function(data) {
        $scope.events = data;
    });

    //Manage Event Function    
    $scope.manageEvent = function(event) {
  
        //Place The Selected Event Into Rootscope
        $rootScope.manageEventView = $scope.events[event];
      
        //Relocate To Event Manage Page
        $location.path('/manageEvent');
    }; 
});