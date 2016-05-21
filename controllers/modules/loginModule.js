var app = angular.module('loginModule', ['ngRoute']);

//Login Controller
app.controller('loginCtrl', function($scope, $location, $rootScope, $http) {

	//Login Credentails Submision
	$scope.submitLoginInfo = function() {
		 
		 //Check If The Fields Are Not Empty
		 if($scope.username == null || $scope.password == null)
		 {
		 	//Generate Toast
			var $toastContent = $('<span>Error : Blank Spaces</span>');
			Materialize.toast($toastContent, 3000);
		 }
		 else
		 {
		 	//User Login Credentials To Object 
		 	user = {
				username: $scope.username,
				password: $scope.password
			};

			//Post The Login Credential          
		 	$http.post('/signin', user).then(function(response) {
				
				//Retrieve The Validation Token Form The Server 
				var verification = response.data.success;
				var message = response.data.message;
				
				//Check If The Validation Token Is True
				if(verification) {

					//Set Conditional Acces To True
					$rootScope.verificationPass = true;

					//Generate Toast
					var $toastContent = $('<span>'+message+'</span>');
					Materialize.toast($toastContent, 3000);

					//Redirect To Dashboar After Validation Is Compleate
					$location.path('/dashboard');
				}
				else {

					//Generate Warning Message
					var $toastContent = $('<span>'+message+'</span>');
					Materialize.toast($toastContent, 3000);
				}
			});
		}
		 
	};

	//Navigate To Code Activator Page
	$scope.codeActivation = function() {
	
		//Redirect To Dashboar After Validation Is Compleate
		$location.path('/codeActivation');  
	};

	//Submit The Activation Code
	$scope.activateAcount = function() {

		//Object Body
		codeBody = {
			code: $scope.code
		 };

		//Post The Login Credential          
		$http.post('/activateMyAccount', codeBody).then(function(response) {

			//Retrieve The Response & Message
			var verify = response.data.activated;

			//If Code Is Correct
			if(verify) {


				var $toastContent = $('<span>Account Activated</span>');
				Materialize.toast($toastContent, 3000);

				//Redirect To Dashboar After Validation Is Compleate
				$location.path('/login');  
			}
			else {

				var $toastContent = $('<span>Wrong Code</span>');
				Materialize.toast($toastContent, 3000);

			}

		}); 
	};    
});