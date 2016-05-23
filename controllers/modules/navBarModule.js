var app = angular.module('navBarModule', ['ngRoute']);

app.controller('navBarCtrl', function($scope, $location, $rootScope, $http) {

        $scope.destroyUserSession = function() {

            console.log("Test");
            $http.get('/destroySession');
            $location.path('/');

            var $toastContent = $('<span>Bye</span>');
        	Materialize.toast($toastContent, 3000);
        };

        $scope.userInbox = function() {

        	var $toastContent = $('<span>Notifications</span>');
        	Materialize.toast($toastContent, 3000);

        	$location.path('/userInbox');	
        };	

        $scope.virtualWallet = function() {

        	var $toastContent = $('<span>Virtual Wallet</span>');
        	Materialize.toast($toastContent, 3000);

        	$location.path('/ticketWallet');	
        };	

        $scope.settings = function() {

        	var $toastContent = $('<span>Settings</span>');
        	Materialize.toast($toastContent, 3000);

        	$location.path('/control_pannel');	
        };	


});