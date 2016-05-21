var app = angular.module('ticketWalletModule', ['ngRoute']);

app.controller('ticketWalletCtrl', function($scope, $location, $rootScope, $http) {

    
    $scope.loadData = function () {
    
      //Get User Info Once They Are Logged In
      $http.get('/getAllMyTickets').success(function(data) {
        $rootScope.tickets = data;
      });
    }; 

    //Load The Tickets
    $scope.loadData();
 
    //Remove User Ticket 
    $scope.removeUserTicket= function(ticket) {

        console.log(ticket);

        $http.post('/removeUserTicket', ticket);

        //Refresh The Scope
        $scope.loadData();

        var $toastContent = $('<span>Ticket Removed</span>');
        Materialize.toast($toastContent, 3000);
    };
      
});