var app = angular.module('mainApp', ['ngRoute']);


//Route Access Configuration
app.config(function($routeProvider) {
   $routeProvider
   
   .when('/', {
       templateUrl: 'views/login_form.html'
   })
   
   .when('/dashboard', {
       
       resolve: {
           "check": function($location, $rootScope) {
               
               //Confirm If LoggedIn Flag Is Set Before Redirecting To Dashboard
               if(!$rootScope.loggedIn) {
                   $location.path('/')
               }
           }
       },
       templateUrl: 'views/dashboard.html'
   })
   
   .when('/register', {
       templateUrl: 'views/register_form.html'
   })
   
   .otherwise({
       redirectTo: '/'
   });
    
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
       $http.post('/signin', user);

       //Redirect To Dashboar After Verification
       $location.path('/dashboard');
        
    };
});
                                    

//Register Controller 
app.controller('registerCtrl', function($scope, $http) {
    $scope.submitRegisterInfo = function() {
        
          person1 = {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            username: $scope.username,
            password: $scope.password
            
        };
        
        var personalInfo = person1;
        $scope.personalInfo = personalInfo;
        
        $http.post('/signup', $scope.personalInfo);
        
    };
});