var app = angular.module('registerModule', ['ngRoute']);

//Registration Controller 
app.controller('registerCtrl', function($scope, $http, $location) {
    
    $scope.submitRegisterInfo = function() {

        //Check For Empty Fields
        if($scope.firstName == null || $scope.lastName == null || $scope.password == null || $scope.password_confirm == null || $scope.username == null) {

            //Toast Message
            var $toastContent = $('<span>Error : Blank Spaces</span>');
            Materialize.toast($toastContent, 3000);
        }
        else {

            //Check If Passwords Match
            if($scope.password != $scope.password_confirm)
            {
                //Toast Message
                var $toastContent = $('<span>Passwords Dont Match</span>');
                Materialize.toast($toastContent, 3000);
            }
            else {
              
                //Create User Object 
                User = {
                    firstName: $scope.firstName,
                    lastName: $scope.lastName,
                    username: $scope.username,
                    password: $scope.password
                
                };
        
                var personalInfo = User;
                $scope.personalInfo = personalInfo;
            
                //Set Post Request To The Backend
                $http.post('/createUser', $scope.personalInfo).then(function(response) {

                    //Retrieve Status & Message Form Backend
                    var status = response.data.status;
                    var message = response.data.message;

                    //If Status Was Successfull Display Message & Direct To Login Page
                    if(status) {

                        var $toastContent = $('<span>'+message+'</span>');
                        Materialize.toast($toastContent, 3000);

                        var $toastContent = $('<span>Activation Code Sent</span>');
                        Materialize.toast($toastContent, 3000);

                        //Relocate To Dashboard
                        $location.path('/login');
                    }
                    else {

                        //If Status Failed Display Message Why
                        var $toastContent = $('<span>'+message+'</span>');
                        Materialize.toast($toastContent, 3000);
                    }
                });
            } 
        } 
    }         
});