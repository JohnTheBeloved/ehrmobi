// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-material', 'ionMdInput','LocalForageModule','ngMessages'])

.run(function($ionicPlatform,MrsService) {
  $ionicPlatform.ready(function() {
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
  });


  MrsService.call('http://localhost:8080',
                "/openmrs/ws/rest/v1/session",
                {method:'GET'},
                { success:function(response){console.log(response)},
                  failure:function(response){console.log(response)}
                }
              );
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/side-menu.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'NavCtrl'
      }
    }
  })

  .state('tab.glucose', {
      url: '/home',
      views: {
        'home': {
          templateUrl: 'templates/glucose.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.pressure', {
      url: '/pressure',
      views: {
        'home': {
          templateUrl: 'templates/pressure.html',
          controller: 'ChatDetailCtrl'
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

  .state('tab.register', {
    url: '/register',
    views: {
      'home': {
        templateUrl: 'templates/register-pg1.html',
        controller: 'RegisterCtrl'
      }
    }
  });

  .state('tab.register', {
    url: '/register:email',
    views: {
      'home': {
        templateUrl: 'templates/register-pg2.html',
        controller: 'RegisterCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
