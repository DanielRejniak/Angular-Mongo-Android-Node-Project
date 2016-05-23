var app = angular.module('dashboardModule', ['ngRoute']);

//Dashboard Controller
app.controller('dashboardCtrl', function($scope, $location, $rootScope, $http) {

    //Obtain User Info Once Logged In
    $http.get('/getUserInfo').success(function(data) {
        $rootScope.userInfo = data;
    });

      //Display Public Events Once The User Is Loged In
      $http.get('/getPublicEventInfo').success(function(data) {
        //console.log(data);
        $scope.events = data;

      });

      //When User Clicks ViewEvent Extract Info And Open Event Viewer
      $scope.findEvent = function(event) {

          //Place The View To Scope
          $scope.eventView = $scope.result[event];

          //Create Object Of The View
          eventView = {
            eventName: $scope.eventView.eventName,
            eventDate: $scope.eventView.eventDate,
            eventCreatedByFirstName: $scope.eventView.eventCreatedByFirstName,
            eventCreatedByLastName: $scope.eventView.eventCreatedByLastName,
            eventTickets: $scope.eventView.eventAvailableTickets,
            eventDescription: $scope.eventView.eventDescription,
            eventLocationCountry: $scope.eventView.eventLocationCountry,
            eventLocationArea: $scope.eventView.eventLocationArea,
            eventImageUrl: $scope.eventView.eventImageUrl,
            eventPublicId: $scope.eventView.eventPublicId,
            eventPrivateId: $scope.eventView.eventPrivateId,
            eventCreatorSessionKey: $scope.eventView.eventCreatorSessionKey
          };

          //Put The Event Info Into Global Scope So Its Visible By Event View Page
          $rootScope.eventViewInfo = eventView;

          //Relocate To Event View Pages
          $location.path('/eventViewer');
      };
});