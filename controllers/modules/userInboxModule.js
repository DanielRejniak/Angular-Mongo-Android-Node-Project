var app = angular.module('userInboxModule', ['ngRoute']);

//Get User Messages 
app.controller('userInboxCtrl', function($scope, $location, $rootScope, $http) {

    //Fetch All The Messages Related To The User
    $http.get('/displayUserMessages').success(function(data) {
      $rootScope.messages = data;
    });

    $scope.findUserMessage = function(message)
    {
        //Fetch The Current Message Info
        $rootScope.currentMessage = $scope.messages[message];

        console.log($scope.currentMessage);

        //Relocate To Event View Pages
        $location.path('/messageViewer');
    }

    $scope.sendReplyMessage = function()
    {
        console.log($scope.messageViewerMessage);

        //console.log("Message : " + $scope.messageViewerMessage + " Event " + $rootScope.currentMessage.eventName);

        messageBody = {

          about: $rootScope.currentMessage.about,
          message: $scope.messageViewerMessage,
          recieverSessionKey: $rootScope.currentMessage.senderSessionKey
        }

        $scope.userReply = messageBody;
        $http.post('/sendUserReply', $scope.userReply);

        var $toastContent = $('<span>Reply Sent</span>');
        Materialize.toast($toastContent, 3000);

        //Message Content $scope.messageViewerMessage
        //Message For Event $rootScope.currentMessage.eventName 

    }

    /*$scope.casualMessage = function()
    {
        console.log($scope.messageViewerMessage);

        //console.log("Message : " + $scope.messageViewerMessage + " Event " + $rootScope.currentMessage.eventName);

        messageBody = {

          message: $scope.messageViewerMessage,
          recieverSessionKey: 
        }

        $scope.userReply = messageBody;
        $http.post('/sendCasualMessage', $scope.userReply);

        //Message Content $scope.messageViewerMessage
        //Message For Event $rootScope.currentMessage.eventName 

    }*/

    $scope.removeUserMessage = function(message)
    {
        console.log("Remove");
        console.log($scope.messages[message]);

        $http.post('/removeUserMessage', $scope.messages[message]);

        var $toastContent = $('<span>Ticket Removed</span>');
        Materialize.toast($toastContent, 3000);
    
    }
  
});