var app = angular.module('configModule', ['ngRoute']);

//Route Access Configuration
app.config(function($routeProvider) {
   $routeProvider
   
   .when('/', 
   {
       templateUrl: 'views/public_views/login_form.html'
   })

   .when('/codeActivation', 
   {
       templateUrl: 'views/public_views/codeActivation.html'
   })
   
   .when('/dashboard', 
   {
       
       resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/dashboard.html'
   })
   
   .when('/register', 
   {
       templateUrl: 'views/public_views/register_form.html'
   })

   .when('/login', 
   {
       templateUrl: 'views/public_views/login.html'
   })

   .when('/control_pannel', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/control_pannel.html'
   })

   .when('/test', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/test.html'
   })

   .when('/inbox_message', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/inbox_message.html'
   })

   .when('/adminMessageViewer', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/adminMessageViewer.html'
   })

   .when('/messageViewer', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/messageViewer.html'
   })

   .when('/eventSettingsPannel', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/eventSettingsPannel.html'
   })

   .when('/create_message', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/create_message.html'
   })

   .when('/userInbox', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/userInbox.html'
   })

   .when('/manualEntryForm', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/manualEntryForm.html'
   })

   .when('/create_event_pannel', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/create_event_pannel.html'
   })

   .when('/manageEvent', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/manageEvents.html'
   })

   .when('/ticketWallet', 
   {
      resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/ticketWallet.html'
   })

   .when('/eventViewer', 
   {
       
       resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/eventViewer.html'
   })

   .when('/contactUser', 
   {
       
       resolve: 
       {
           "check": function($location, $rootScope) 
           {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.verificationPass) 
               {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/loggedin_views/contactUser.html'
   })
   
   .otherwise(
   {
       redirectTo: '/'
   });
    
});