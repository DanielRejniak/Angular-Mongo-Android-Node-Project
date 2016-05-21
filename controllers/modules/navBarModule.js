var app = angular.module('navBarModule', ['ngRoute']);

app.controller('navBarCtrl', function($scope, $location, $rootScope, $http) {

        $scope.destroyUserSession = function() {

            console.log("Test");
            $http.get('/destroySession');
            $location.path('/');
        };
});