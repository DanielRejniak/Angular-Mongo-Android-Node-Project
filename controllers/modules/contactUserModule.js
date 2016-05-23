var app = angular.module('contactUserModule', ['ngRoute']);

app.controller('contactUserCtrl', function($scope, $location, $rootScope, $http) {

    $scope.sendMessage = function() {
    
        messageBody = {

            about: $rootScope.adminMessage.ticketForEvent,
            message: $scope.userMessage,
            recieverSessionKey: $rootScope.adminMessage.ticketUserSession,
        };

        var $toastContent = $('<span>Message Sent</span>');
        Materialize.toast($toastContent, 3000);

        $http.post('/sendUserMessage', messageBody);

        $location.path('/control_pannel');
    };
});        
