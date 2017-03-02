angular.module('starter.services', [])

.service('MrsService', function($http) {
     
    this.call = function(host,endpoint, opts, handle){

        var req = {
         method: opts['method'],
         url: host+endpoint,
         headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Basic ' + btoa('john.developer' + ':' + 'Silver1963$')
         },
         data: opts['data']
        }
        $http(req).then(handle['success'], handle['failure']);

    }
})

.service('RegistrationService',function(MrsService,OpenMRSAPIModelFactory){

  var host = "http://localhost:8080"
  var endpoint = "/openmrs/ws/rest/v1/"

  function createPatientFromPerson(uuid,phone){
      var patient = OpenMRSAPIModelFactory.getPatientStub(uuid,phone)
      console.log(patient);
       MrsService.call(host,endpoint+'patient',{data:patient,method:"POST"}, {success:function(patient){DataFactory.appendProperty(createdPerson.email,'uuid',patient.uuid)},failure:function(response){console.log(response)}})
  }

    this.registerPatient = function(patient){
      var person = OpenMRSAPIModelFactory.getPersonStub(patient.firstName,patient.lastName,patient.middleName,
        patient.dateOfBirth, patient.gender,patient.phone,
        patient.lineOne, patient.lineTwo,patient.city, patient.state,patient.picture,
        patient.weight,patient.height)
      MrsService.call(host,endpoint+'person',{data:person,method:"POST"}, {success:function(person){createPatientFromPerson(person.uuid,patient.phone)},failure:function(response){console.log(response)}})
    }


})

.service('AuthService',function(MrsService,DataFactory,$q){
     
    this.initSession = function(){
        MrsService.call('http://localhost:8080',
          "/openmrs/ws/rest/v1/session",
          {method:'GET'},
          { success:function(response){
            console.log("Application Authenticated",response);
            DataFactory.save("session",response)
          },
            failure:function(response){console.log("Application not authenticated",response)}
          }
        );
    };

    var loggedIn = false;

    function authenticated(){
      this.loggedIn = true;
    }

    this.keepLogin = function(username,password){
        loggedIn = true;
        console.log(username,password);
        return DataFactory.save("loggedIn",{"username":username})
    }

    this.personLoggedIn = function(){
        var gotten = $q.defer();
        DataFactory.retrieve("loggedIn")
        .then(function(user){
          console.log(user);
          DataFactory.retrieve(user.username)
          .then(function(patient){
              if(patient){
                gotten.resolve(patient);
              }else{
                gotten.reject("Not found");
              }
          });
        });

        return gotten.promise;
    }

    this.initAuth = function(){
      DataFactory.retrieve("loggedIn").then(function(data){
        if(data){
          loggedIn = true;
        }
      });
    }

    this.isLoggedIn = function(){
      return loggedIn;
    }

})

 
.directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue === scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});
