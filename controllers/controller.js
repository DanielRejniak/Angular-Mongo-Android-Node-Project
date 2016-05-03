var app = angular.module('mainApp', ['ngRoute']);


//Route Access Configuration
app.config(function($routeProvider) {
   $routeProvider
   
   .when('/', 
   {
       templateUrl: 'views/public_views/login_form.html'
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
   
   .otherwise(
   {
       redirectTo: '/'
   });
    
});

//Ticket Wallet Controller
app.controller('ticketWalletCtrl', function($scope, $location, $rootScope, $http) {

    //Get User Info Once They Are Logged In
    $http.get('/getAllMyTickets').success(function(data) {
      $rootScope.tickets = data;
    });
      
});

//Get Admin Messages 
app.controller('adminInboxCtrl', function($scope, $location, $rootScope, $http) {

    //Get User Info Once They Are Logged In
    $http.get('/displayAdminMessages').success(function(data) {
      $rootScope.messages = data;
    });
      
    $scope.getAdminMessage = function(message)
    {
        //Fetch The Admin Message For Message Viewer
        console.log("View");
        //console.log($scope.messages[message]);

        $rootScope.currentAdminMessage = $scope.messages[message];
        $location.path('/adminMessageViewer');
    }  

    $scope.removeAdminMessage = function(message)
    {
        //Remove Admin Message 
        console.log("Remove");
        //console.log($scope.messages[message]);

        $http.post('/removeAdminMessage', $scope.messages[message]).success(function(data) {
        $scope.testy = data;
        //console.log($rootScope.eventView.eventName);
        //Relocate To Event View Pages
        
        });
    }

    $scope.sendAdminMessage = function(event) {

        messageBody = {
            eventName: $rootScope.currentAdminMessage.eventName,
            firstNameTo: $scope.currentAdminMessage.firstNameFrom,
            lastNameTo: $scope.currentAdminMessage.lastNameFrom,
            message: $scope.adminMessage
        }

        $scope.adminMessage = messageBody;
        $http.post('/sendAdminMessage', $scope.adminMessage);
      };


});

//Get User Messages 
app.controller('userInboxCtrl', function($scope, $location, $rootScope, $http) {

    //Fetch All The Messages Related To The User
    $http.get('/displayUserMessages').success(function(data) {
      $rootScope.messages = data;
    });

    $scope.findUserMessage = function(message)
    {
        //Fetch The Current Message Info
        $rootScope.currentMessage = $scope.messages[message];

        console.log($scope.currentMessage);

        //Relocate To Event View Pages
        $location.path('/messageViewer');
    }

    $scope.sendMessage = function()
    {
        console.log($scope.messageViewerMessage);

        //console.log("Message : " + $scope.messageViewerMessage + " Event " + $rootScope.currentMessage.eventName);

        messageBody = {

          message: $scope.messageViewerMessage,
          event: $rootScope.currentMessage.eventName,
          firstNameTo: $rootScope.currentMessage.firstNameFrom,
          lastNameTo: $rootScope.currentMessage.lastNameFrom,
        }

        $scope.userReply = messageBody;
        $http.post('/sendUserReply', $scope.userReply);

        //Message Content $scope.messageViewerMessage
        //Message For Event $rootScope.currentMessage.eventName 

    }

    $scope.removeUserMessage = function(message)
    {
        console.log("Remove");
        console.log($scope.messages[message]);

        $http.post('/removeUserMessage', $scope.messages[message]).success(function(data) {
        $scope.testy = data;
        //console.log($rootScope.eventView.eventName);
        //Relocate To Event View Pages
        
        });
    }
  
});

//Dashboard Controller
app.controller('dashboardCtrl', function($scope, $location, $rootScope, $http) {

      //Get User Info Once They Are Logged In
      $http.get('/getUserInfo').success(function(data) {
        $rootScope.userInfo = data;
      });

      //Display Public Events Once The User IS Loged In
      $http.get('/getPublicEventInfo').success(function(data) {
        //console.log(data);
        $scope.events = data;
      });

      //When User Clicks ViewEvent Extract Info And Open Event Viewer
      $scope.findEvent = function(event) {

          //Place The View To Scope
          $scope.eventView = $scope.events[event];
          //console.log($scope.eventView.eventCreatedByFirstName);
          //console.log($scope.eventView.eventCreatedByLastName);
          console.log($scope.events[event]);
        
          //Create Object Of The View
          eventView = {
            eventName: $scope.eventView.eventName,
            eventDate: $scope.eventView.eventDate,
            eventLocation: $scope.eventView.eventLocation,
            eventCreatedByFirstName: $scope.eventView.eventCreatedByFirstName,
            eventCreatedByLastName: $scope.eventView.eventCreatedByLastName,
            eventTickets: $scope.eventView.eventAvailableTickets,
            eventDescription: $scope.eventView.eventDescription,
            eventLocationCountry: $scope.eventView.eventLocationCountry,
            eventLocationArea: $scope.eventView.eventLocationArea,
            eventImageUrl: $scope.eventView.eventImageUrl
          };

          console.log(eventView);

          //Put The Event Info Into Global Scope So Its Visible By Event View Page
          $rootScope.eventViewInfo = eventView;

          //Relocate To Event View Pages
          $location.path('/eventViewer');

        

      };
});

//Manage Event Controller
app.controller('manageEventCtrl', function($scope, $location, $rootScope, $http) {

   //Find All Tickets That Belong To The Event
   $http.post('/getEventGuest', $rootScope.manageEventView).success(function(data) {
        $scope.tickets = data;
        //console.log($rootScope.eventView.eventName);
    });

   //Activate Event
   $scope.activateEvent = function() {

      $http.post('/activateEvent', $rootScope.manageEventView).success(function(data) {
        //$scope.tickets = data;
        //console.log($rootScope.eventView.eventName);
      });
   };

   //Deactivate Event 
   $scope.deactivateEvent = function() {

      $http.post('/deactivateEvent', $rootScope.manageEventView).success(function(data) {
        //$scope.tickets = data;
        //console.log($rootScope.eventView.eventName);
      });
   };

   $scope.banUser = function(ticket) {

      
      $scope.ticket = $scope.tickets[ticket];
      //console.log($scope.ticket);

      $http.post('/banUser',  $scope.ticket).success(function(data) {
        $scope.tickets = data;
        //console.log($rootScope.eventView.eventName);
      });
   };
});

//Event Viewer Controller
app.controller('eventViewerCtrl', function($scope, $location, $rootScope, $http) {

      //console.log(eventView);

      //When User Clicks Get Ticket
      $scope.getTicket = function(event) {

          console.log("Get This Ticket");
          var eventNameConcat = $scope.eventViewInfo.eventName.split(' ').join('');
          var userNameConcat = $scope.userInfo.firstName + $scope.userInfo.lastName;
          var ticketId = eventNameConcat + userNameConcat;
          
          ticketID = {

            ticketId: ticketId,
            ticketOwnerFirstName: $scope.userInfo.firstName,
            ticketOwnerLastName: $scope.userInfo.lastName,
            ticketForEvent: eventNameConcat
          };

          $scope.ticketInfo = ticketID;
          $http.post('/createTicket', $scope.ticketInfo);

      };

      $scope.sendUserMessage = function(event) {

        message = {

            eventName: $scope.eventViewInfo.eventName,
            eventOrganiserFirstName: $scope.eventViewInfo.eventCreatedByFirstName,
            eventOrganiserLastName: $scope.eventViewInfo.eventCreatedByLastName,
            message: $scope.eventMessage
        };

        $scope.messages = message;
        $http.post('/sendUserMessage', $scope.messages);
      };
});

//Event Creator Controller
app.controller('eventCreatorCtrl', function($scope, $location, $rootScope, $http) {
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

        $http.post('/createEvent', $scope.eventInfo).then(function(err){

            if(err) {
                

            }
            else {

                  //When Event Is Created Successfuly Redirect
                  console.log("Error - Can't Create Event");
                  $location.path('/dashboard');
            }
        });
  };

}); 

//Login Controller
app.controller('loginCtrl', function($scope, $location, $rootScope, $http) {
    $scope.submitLoginInfo = function() {
       
       //User Login Credentials Object 
       user = {
           username: $scope.username,
           password: $scope.password
    
       };
       
       //Post The Login Credential Object To Node          
       $http.post('/signin', user).then(function(response){
          
          //Retrieve The Validation Token Form The Server 
          var verification = response.data.success;
          
          //Check If The Validation Token Is True
          if(verification){

            $rootScope.verificationPass = true;
            console.log("Verification Successfull, Redirecting To Dashboard");

            //Redirect To Dashboar After Validation Is Compleate
            $location.path('/dashboard');
          }
          else {

            //Redirect To Login Page
            console.log("Verification Failed");
            $location.path('/');
          }
        });
      };
});
                                    

//Register Controller 
app.controller('registerCtrl', function($scope, $http, $location) {
    $scope.submitRegisterInfo = function() {

        if($scope.password != $scope.password_confirm)
        {
            console.log("Error : Passwords Dont Match ");
            $location.path('/');

        }
        else
        {
        
          person1 = {
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          username: $scope.username,
          password: $scope.password
            
          };
        
          var personalInfo = person1;
          $scope.personalInfo = personalInfo;
        
          $http.post('/createUser', $scope.personalInfo);
          $location.path('/');
        }  
        
    };
});

//Control Pannel Controller 
app.controller('controlPannelCtrl', function($scope, $http, $location, $rootScope) {

  //Count The Amount Of Events Created By Current User
  $http.get('/countMyEvents').success(function(data) {
    $scope.test = data;
  });

  //Count The Amount Of Active Events Created By Current User
  $http.get('/countMyActiveEvents').success(function(data) {
    $scope.test1 = data;
  });

  //Count The Amount Of Messages
  $http.get('/countMyMessages').success(function(data) {
    $scope.test2 = data;
  });

  //Display Event That Belong To Logged In User
  $http.get('/displayMyEvents').success(function(data) {
    $scope.events = data;
  });

 

  

  $scope.manageEvent = function(event) {
  
      //Place The View To Scope
      $rootScope.manageEventView = $scope.events[event];
      
      //Relocate To Event Manage Page
      $location.path('/manageEvent');
  }; 
    
});