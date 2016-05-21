var app = angular.module('manageEventModule', ['ngRoute']);

//Manage Event Controller
app.controller('manageEventCtrl', function($scope, $location, $rootScope, $http) {

   //Set Scope Value For Update
    $scope.eventNameUpdate = $rootScope.manageEventView.eventName;
    $scope.eventLocationCountryUpdate = $rootScope.manageEventView.eventLocationCountry;
    $scope.eventLocationAreaUpdate = $rootScope.manageEventView.eventLocationArea;
    $scope.eventStartTimeUpdate = $rootScope.manageEventView.eventStartTime;
    $scope.eventFinishTimeUpdate = $rootScope.manageEventView.eventFinishTime;
    $scope.eventCategoryUpdate = $rootScope.manageEventView.eventCategory;
    $scope.eventDateUpdate = $rootScope.manageEventView.eventDate;
    $scope.eventAvailableTicketsUpdate = $rootScope.manageEventView.eventAvailableTickets;
    $scope.eventImageUrlUpdate = $rootScope.manageEventView.eventImageUrl;
    $scope.eventDescriptionUpdate = $rootScope.manageEventView.eventDescription;


   //Find All Tickets That Belong To The Event
   $http.post('/getEventGuest', $rootScope.manageEventView).success(function(data) {
        $scope.tickets = data;
        //console.log($rootScope.eventView.eventName);
    });

   //Activate Event
   $scope.activateEvent = function() {

      var $toastContent = $('<span>Event Activated</span>');
      Materialize.toast($toastContent, 3000);

      $http.post('/activateEvent', $rootScope.manageEventView).success(function(data) {

      });
   };

   //Deactivate Event 
   $scope.deactivateEvent = function() {

      var $toastContent = $('<span>Event Deactivated</span>');
      Materialize.toast($toastContent, 3000);

      $http.post('/deactivateEvent', $rootScope.manageEventView).success(function(data) {
          
      });
   };


   //Deactivate Event 
   $scope.removeEvent = function() {

      //Remove The Event
      var $toastContent = $('<span>Event Removed</span>');
      Materialize.toast($toastContent, 3000); 

      $http.post('/removeEvent', $rootScope.manageEventView);

      //Remove All The Tickets
   };

   $scope.banUser = function(ticket) {

      
      $scope.ticket = $scope.tickets[ticket];
      //console.log($scope.ticket);

      $http.post('/banUser',  $scope.ticket).success(function(data) {
        $scope.tickets = data;
        //console.log($rootScope.eventView.eventName);
      });
   };

   //Manual Entry Form
   $scope.manualEntryForm = function(ticket) {

      //Relocate To Event View Pages
      $rootScope.ticketOwnerDetails = ticket;

      console.log($rootScope.ticketOwnerDetails);
      $location.path('/manualEntryForm');
      
   };

   //Manual Entry Form
   $scope.requestEntry = function() {

      var $toastContent = $('<span>Requesting Entry</span>');
      Materialize.toast($toastContent, 3000);
      
      console.log($rootScope.ticketOwnerDetails.ticketId);
      console.log($scope.code);
   };

   //Update The Event Information
   $scope.updateEventInfo = function() {

      updatedEventInfo = {

        eventNameOriginal: $rootScope.manageEventView.eventName,
        eventName: $scope.eventNameUpdate,
        eventCountryLocation: $scope.eventLocationCountryUpdate,
        eventAreaLocation: $scope.eventLocationAreaUpdate,
        eventDate: $scope.eventDateUpdate,
        eventAvailableTickets: $scope.eventAvailableTicketsUpdate,
        eventDescription: $scope.eventDescriptionUpdate,
        eventImageUrl: $scope.eventImageUrlUpdate,
        eventLocationCountry: $scope.eventLocationCountryUpdate,
        eventLocationArea: $scope.eventLocationAreaUpdate,
        eventCategory: $scope.eventCategoryUpdate,
        eventStartTime: $scope.eventStartTimeUpdate,
        eventFinishTime: $scope.eventFinishTimeUpdate
      };
     
      $http.post('/updateEvent',updatedEventInfo);

      var $toastContent = $('<span>Applying Changes</span>');
      Materialize.toast($toastContent, 3000);

      var $toastContent = $('<span>Event Updated</span>');
      Materialize.toast($toastContent, 3000);

   };
});