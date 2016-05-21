var app = angular.module('feedbackModule', ['ngRoute']);

app.controller('feedbackCtrl', function($scope, $location, $rootScope, $http) {

    $scope.submitFeedback = function() {
    
      feedback = {
        name: $scope.name,
        email: $scope.email,
        message: $scope.message
      }

      $scope.userFeedback = feedback;
      $http.post('/sendUserFeedback', $scope.userFeedback);

      var $toastContent = $('<span>Thank You For Your Feedback</span>');
      Materialize.toast($toastContent, 3000);

    }
});