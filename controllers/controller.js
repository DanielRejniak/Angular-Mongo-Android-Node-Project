//This Is the main controller that operates the entire web application.
//It allows the app to acces any of the modules listed bellow.

var app = angular.module('mainApp', 
  [
    //Include All Required Modules
    'navBarModule',
    'ui.materialize',
    'ui.materialize.slider',
    'ui.materialize.collapsible',
    'ui.materialize.sidenav',
    'ngRoute', 
    'loginModule', 
    'dashboardModule',
    'feedbackModule',
    'controlPannelModule',
    'ticketWalletModule',
    'manageEventModule',
    'registerModule',
    'eventCreatorModule',
    'eventViewerModule',
    'adminInboxModule',
    'userInboxModule',
    'configModule',
    'contactUserModule'
  ]
);
