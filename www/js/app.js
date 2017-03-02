// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.factories', 'ionic-material', 'ionMdInput','LocalForageModule','ngMessages'])

.run(function($ionicPlatform,MrsService,AuthService,$rootScope,$ionicLoading,$ionicPopup) {
  $ionicPlatform.ready(function() {

    AuthService.initSession();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    function showAlert(message,afterEffect) {
       
        if(afterEffect){
            var alertPopup = $ionicPopup.alert({
             title: 'Message',
             template: message
            }).then(afterEffect);
        }else{
            var alertPopup = $ionicPopup.alert({
             title: 'Message',
             template: message
            })
           return alertPopup;
        }
 
    };

    function askAlert(scope,title,subtitle, message,afterEffect) {
        
        if(afterEffect){
            var alertPopup = $ionicPopup.show({
             title: title,
             subTitle:subtitle,
             template: message,
             scope:scope,
             buttons:[
                {
                    text:'Cancel'},
                {
                    text:'Save',
                    type: 'button-positive',
                    onTap:afterEffect
                }
             ]
            });
        }else{
            var alertPopup = $ionicPopup.alert({
             title: 'Message',
             template: message
            })
           return alertPopup;
        }
 
    };

    function loading(message) {
        var message = message ? message : "Loading...";
        $ionicLoading.show({
          template: '<p>'+message+'</p><ion-spinner></ion-spinner>'
        });
    };


    function loaded(message, thenDoThis){
        if(message){
            $ionicLoading.hide(); 
            showAlert(message);
            if(thenDoThis){
                thenDoThis();
            }
        }else{
           $ionicLoading.hide(); 
        }
    };

    $rootScope.showAlert = showAlert;
    $rootScope.askAlert = askAlert;
    $rootScope.loading = loading;
    $rootScope.loaded = loaded;

    AuthService.initAuth();
  });


  
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  .state('auth', {
    url: '/auth',
    abstract: true,
    templateUrl: 'templates/auth.html',
    onEnter: function($state, AuthService) {
       if(AuthService.isLoggedIn() || AuthService.registering) {
         //$state.go('tab.home');
       }
    }
  })

  .state('auth.login', {
    url: '/login',
    views: {
      'auth': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('auth.register', {
    url: '/register',
    views: {
      'auth': {
        templateUrl: 'templates/register-pg1.html',
        controller: 'RegisterCtrl'
      }
    }
  })

  .state('auth.register2', {
    url: '/register/:email',
    views: {
      'auth': {
        templateUrl: 'templates/register-pg2.html',
        controller: 'RegisterCtrl'
      }
    }
  })


  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/side-menu.html',
    onEnter: function($state, AuthService) {
      if(!AuthService.isLoggedIn()) {
        $state.go('auth.login');
      }
    }
  })

  .state('tab.dashboard', {
    url: '/dashboard',
    views: {
      'dashboard': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })

 
  .state('tab.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.glucose', {
      url: '/glucose',
      views: {
        'glucose': {
          templateUrl: 'templates/glucose.html',
          controller: 'GlucoseCtrl'
        }
      }
    })
    .state('tab.pressure', {
      url: '/pressure',
      views: {
        'pressure': {
          templateUrl: 'templates/pressure.html',
          controller: 'PressureCtrl'
        }
      }
    })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'home': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.locations', {
    url: '/locations',
    views: {
      'home': {
        templateUrl: 'templates/locations.html',
        controller: 'LocationCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
