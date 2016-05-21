var app = angular.module('adminInboxModule', ['ngRoute']);

//Get Admin Messages 
app.controller('adminInboxCtrl', function($scope, $location, $rootScope, $http) {

    //Get User Info Once They Are Logged In
    $http.get('/displayAdminMessages').success(function(data) {
      $rootScope.messages = data;
    });
      
    $scope.getAdminMessage = function(message)
    {
        //Fetch The Admin Message For Message Viewer
        console.log("View");
        //console.log($scope.messages[message]);

        $rootScope.currentAdminMessage = $scope.messages[message];
        $location.path('/adminMessageViewer');
    }  

    $scope.removeAdminMessage = function(message)
    {
        //Remove Admin Message 
        console.log("Remove");
        //console.log($scope.messages[message]);

        $http.post('/removeAdminMessage', $scope.messages[message]).success(function(data) {
        $scope.testy = data;
        //console.log($rootScope.eventView.eventName);
        //Relocate To Event View Pages
        
        });
    }

    $scope.sendAdminMessage = function(event) {

        messageBody = {
            eventName: $rootScope.currentAdminMessage.eventName,
            firstNameTo: $scope.currentAdminMessage.firstNameFrom,
            lastNameTo: $scope.currentAdminMessage.lastNameFrom,
            message: $scope.adminMessage
        }

        $scope.adminMessage = messageBody;
        $http.post('/sendAdminMessage', $scope.adminMessage);
      };


});