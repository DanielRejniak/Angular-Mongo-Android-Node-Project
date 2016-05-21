var app = angular.module('eventViewerModule', ['ngRoute']);

//Event Viewer Controller
app.controller('eventViewerCtrl', function($scope, $location, $rootScope, $http) {

      //console.log(eventView);

      //When User Clicks Get Ticket
      $scope.getTicket = function(event) {

          console.log("Get This Ticket");
          var eventNameConcat = $scope.eventViewInfo.eventName;
          var userNameConcat = $scope.userInfo.firstName + $scope.userInfo.lastName;
          var ticketId = eventNameConcat + userNameConcat;
          
          ticketID = {

            ticketId: ticketId,
            ticketOwnerFirstName: $scope.userInfo.firstName,
            ticketOwnerLastName: $scope.userInfo.lastName,
            ticketForEvent: eventNameConcat,
            ticketEventPublicId: $rootScope.eventViewInfo.eventPublicId,
            ticketEventPrivateId: $rootScope.eventViewInfo.eventPrivateId
          };

          $scope.ticketInfo = ticketID;
          $http.post('/createTicket', $scope.ticketInfo).then(function(response) {

              var createdStatus = response.data.created;
              var existStatus = response.data.exists;

              if(createdStatus == true)
              {
                  var $toastContent = $('<span>Ticket Added To Wallet</span>');
                  Materialize.toast($toastContent, 3000);
              }

              if(existStatus == true)
              {
                  var $toastContent = $('<span>Ticket Already In Wallet</span>');
                  Materialize.toast($toastContent, 3000);
              }
          });

      };

      $scope.sendMessage = function(event) {

        message = {

            about: $scope.eventViewInfo.eventName,
            message: $scope.eventMessage,
            recieverSessionKey: $scope.eventViewInfo.eventCreatorSessionKey
        };

        $scope.messages = message;
        $http.post('/sendMessage', $scope.messages);

        var $toastContent = $('<span>Message Sent</span>');
        Materialize.toast($toastContent, 3000);
      };
});