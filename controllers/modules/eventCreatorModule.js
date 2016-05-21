var app = angular.module('eventCreatorModule', ['ngRoute']);



//Event Creator Controller
app.controller('eventCreatorCtrl', function($scope, $location, $rootScope, $http) {

   $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 2, // Creates a dropdown of 15 years to control year
        min: true //Noting Before Todays Date

    });  
    
    $scope.createEvent = function() {

        event = {

            eventName: $scope.eventName,
            eventLocation: $scope.eventLocation,
            eventDate: $scope.eventDate,
            eventAvailableTickets: $scope.eventAvailableTickets,
            eventDescription: $scope.eventDescription,
            eventImageUrl: $scope.eventImageUrl,
            eventLocationCountry: $scope.eventLocationCountry,
            eventLocationArea: $scope.eventLocationArea,
            eventCategory: $scope.eventCategory,
            eventStartTime: $scope.eventStartTime,
            eventFinishTime: $scope.eventFinishTime
        }

        var eventObject = event;
        $scope.eventInfo = eventObject;

        $http.post('/createEvent', $scope.eventInfo).success(function(err){

            if(!err) {
                
                var $toastContent = $('<span>Event Created</span>');
                Materialize.toast($toastContent, 3000);

                $location.path('/control_pannel');

            }
            else {

                  //When Event Is Created Successfuly Redirect
                  console.log("Error - Can't Create Event");
                  $location.path('/dashboard');
            }
        });
  };

}); 