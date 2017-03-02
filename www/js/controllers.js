angular.module('starter.controllers', [])

.controller('HomeCtrl', function(){

})

.controller('LocationCtrl', function($scope,AuthService,DataFactory,RegistrationService){
    $scope.syncData = function(){
        AuthService.personLoggedIn()
        .then(function(patient){
            if(patient && !patient.uuid){
                RegistrationService.registerPatient(patient);
            }
        })
    
    }
})

.controller('DashCtrl', function($scope,AuthService,DataFactory, $ionicPopup,$ionicLoading) {

    var loading = $scope.loading;
    var loaded = $scope.loaded;
    var showAlert = $scope.showAlert;
    var askAlert = $scope.askAlert;
 
    $scope.popupData = {};
    
    $scope.patient = {};
    loading();
    AuthService.personLoggedIn()
    .then(function(patient){
        $scope.patient = patient;
       
        $scope.patient.alerts = [

            {
                message:"You have not checked your Blood pressure for the past 5 days",
                time:new Date()
            }
        ];
        loaded();
    })

   

    $scope.addGlucose = function(){
        $scope.popupData.glucose = 0;
        askAlert($scope,'Blood Glucose',
            'Please, measure and enter blood glucose value (unit is in mg/dl)',
            '<input type="number" ng-model="popupData.glucose">',
            function(e){
                if(!$scope.popupData.glucose){
                    e.preventDefault();
                }else{
                    $scope.patient.glucoses.push({value:$scope.popupData.glucose,time:new Date()});
                    DataFactory.appendProperty($scope.patient.email,"glucoses",$scope.patient.glucoses);
                    $scope.reloadPatient();
                }
            });
    };

    $scope.reloadPatient = function(){
        DataFactory.retrieve($scope.patient.email)
        .then(function(patient){
            if(patient){
                $scope.patient = patient;
                console.log(patient)
            }
        });
    }

    $scope.addPressure = function(){
        $scope.popupData.pressureSystole = 0;
        $scope.popupData.pressureDiastole = 0;
        var ppp = askAlert($scope,'Blood Pressure',
            'Please, measure and record blood pressure value (unit is in mmhg)',
            '<input type="number" ng-model="popupData.pressureSystole" placeholder="Enter Systole"><input type="number" ng-model="popupData.pressureDiastole" placeholder=" Enter Diastole">',
            function(e){
                if(!($scope.popupData.pressureSystole && $scope.popupData.pressureDiastole)){
                    e.preventDefault();
                }else{
                    $scope.patient.pressures.push(
                        {
                            systole: $scope.popupData.pressureSystole,
                            diastole: $scope.popupData.pressureDiastole,
                            time: new Date()
                        }
                    );
                    DataFactory.appendProperty($scope.patient.email,"pressures",$scope.patient.pressures);
                    $scope.reloadPatient();
                }
            });
    }


})

.controller('GlucoseCtrl', function($scope,AuthService) {
   var loading = $scope.loading;
    var loaded = $scope.loaded;
    var showAlert = $scope.showAlert;
    var askAlert = $scope.askAlert;
 

    $scope.syncGlucoses = function(){
        loading();
        AuthService.personLoggedIn()
        .then(function(patient){
            $scope.glucoses = patient.glucoses;
            loaded();
        });
    }

    $scope.timeString = function(timeStringIn){
        var time = new Date(timeStringIn)
        return time.toDateString() + " " + time.toLocaleTimeString();
    }

    $scope.syncGlucoses();
    
})


.controller('PressureCtrl', function($scope,AuthService) {
    var loading = $scope.loading;
    var loaded = $scope.loaded;
    var showAlert = $scope.showAlert;
    var askAlert = $scope.askAlert;    

    $scope.syncPressures = function(){
        loading();
        AuthService.personLoggedIn()
        .then(function(patient){
            $scope.pressures = patient.pressures;
            loaded();
        });
    }

    $scope.timeString = function(timeStringIn){
        var time = new Date(timeStringIn)
        return time.toDateString() + " " + time.toLocaleTimeString();
    }

    $scope.syncPressures();
    
})



.controller('NavCtrl', function($scope,MrsService, $ionicSideMenuDelegate) {
      $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
      };
})
 
.controller('RegisterCtrl', function($scope,$state,$stateParams,DataFactory,AuthService) {
    
    var loading = $scope.loading;
    var loaded = $scope.loaded;
    var showAlert = $scope.showAlert;
    var askAlert = $scope.askAlert;
    
    var goToReg2 = function(){
        $state.go('auth.register2',{email:$scope.patient.email});
    }

    var goToDashboard = function(){
        $state.go('tab.home')
    }

    var email = $stateParams.email; 
    if(email){
        loading();
        DataFactory.retrieve(email)
        .then(function(patient){
            if(patient && patient.email){
                $scope.patient = patient;
                loaded();
            }else{
                loaded("Error occured retriving saved Data, Please Start again",function(){$state.go('auth.register')})
            }
        });
    }else{
         $scope.patient = {
            firstName:'',
            lastName:'',
            middleName:'',
            email:'',
            gender:'M',
            dateOfBirth:'',
            picture:'',
            weight:'',
            height:'',
            password:'',
            confirmPassword:'',
            pressures:[],
            glucoses:[],
            alerts:[]
        }
    }

    $scope.savePage1 = function(form) {
        
        if(form.$valid) {
            loading();
            DataFactory.save($scope.patient.email,$scope.patient)
            .then(function(){
                loaded('<b>Success</b>: Basic Data Successfully saved',goToReg2);
            });
        }else{
            showAlert("Form Data not Valid, Please review")
        }
    };

    $scope.savePage2 = function(form) {
        
        if(form.$valid) {
            loading();
            DataFactory.save($scope.patient.email,$scope.patient)
            .then(function(){
                AuthService.keepLogin($scope.patient.email,$scope.patient.password).then(function(){
                    loaded('<b>Success</b>: Basic Information Registered',goToDashboard);
                });                
            });
        }else{
            showAlert("Form Data not Valid, Please review")
        }
    };

})


.controller('AppCtrl', function($scope, $ionicModal) {
    // Form data for the login modal
    $scope.getUsername = function() {
        return AuthService.getUsername();
    }
     
    $scope.getHost = function() {
        return AuthService.getHost();
    }

    $scope.goHome = function() {
        $state.go('tab.home');
    }

})

.controller('LoginCtrl', function($scope,$state,DataFactory,AuthService, $ionicPopup,$ionicLoading) {

    var loading = $scope.loading;
    var loaded = $scope.loaded;
    var showAlert = $scope.showAlert;
    var askAlert = $scope.askAlert;

    $scope.login = {
        username:'',
        password:''
    };

    $scope.init = function() {
        $scope.passcode = "";
    }

    $scope.add = function(value) {
        if($scope.passcode.length < 4) {
            $scope.passcode = $scope.passcode + value;
            if($scope.passcode.length == 4) {
                $timeout(function() {

                }, 500);
            }
        }
    }

    $scope.delete = function() {
        if($scope.passcode.length > 0) {
            $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
        }
    }
 
    var goToDashboard = function(){
        $state.go('tab.home');
    }
    
    $scope.loginUser = function(form) {

    if(form.$valid) {
        loading();
        DataFactory.retrieve($scope.login.username)
        .then(function(patient){
            if(patient && patient.password && patient.password == $scope.login.password){
                AuthService.keepLogin(patient.email, patient.password).then(function(){
                    loaded("Login Successfull",goToDashboard);
                });
            }else{
                loaded("<b>Sorry:</b> Login Details not correct");
            }
        });
    }else{
        loaded("<b>Sorry;</b> Login Details not correct")
    }
    };
})
 

.controller('ProfileCtrl', function($scope, $stateParams, $timeout,AuthService,DataFactory) {
    $scope.popupData = {};
    var loading = $scope.loading;
    var loaded = $scope.loaded;
    var showAlert = $scope.showAlert;
    var askAlert = $scope.askAlert;

    $scope.patient = {};
    loading();
    AuthService.personLoggedIn()
    .then(function(patient){
        $scope.patient = patient;
        loaded();
    });

    $scope.reloadPatient = function(){
        DataFactory.retrieve($scope.patient.email)
        .then(function(patient){
            if(patient){
                $scope.patient = patient;
                console.log(patient)
            }
        });
    }

    $scope.updateWeight = function(){
        $scope.popupData.weight = 0;
        askAlert($scope,'Update Body Weight',
        'Please, measure and enter your body weight (unit is in Kg)',
        '<input type="number" ng-model="popupData.weight">',
        function(e){
            if(!$scope.popupData.weight){
                e.preventDefault();
            }else{
                $scope.patient.weight = $scope.popupData.weight;
                DataFactory.appendProperty($scope.patient.email,"weight",$scope.patient.weight)
                .then(function(){$scope.reloadPatient()});                
            }
        });
    }


    $scope.updateHeight = function(){
        $scope.popupData.height = 0;
        askAlert($scope,'Update Body Height',
        'Please, measure and enter your body height (unit is in metres)',
        '<input type="number" ng-model="popupData.height">',
        function(e){
            if(!$scope.popupData.height){
                e.preventDefault();
            }else{
                $scope.patient.height = $scope.popupData.height;
                console.log($scope.patient)
                DataFactory.appendProperty($scope.patient.email,"height",$scope.patient.height)
                .then(function(){$scope.reloadPatient()})
                

            }
        });
    }

});