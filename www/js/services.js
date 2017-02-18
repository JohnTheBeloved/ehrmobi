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


.factory('DataFactory', function($localForage) {



  var getPatientStub = function(firstName,middleName,lastName,
    dateOfBirth,gender,email,phone,password)
  {
    var patient = {
      person:{
        "addresses": [
          {}
        ],
        "names": [
          {
            givenName:firstName,
            familyName:lastName,
            middleName:middleName
          }
        ],
        "birthdate": dateOfBirth,
        "gender": gender,
        "attributes": {
          email: email,
          phone:phone,
          password:password
        }
      }
    }
    return patient;
  }
  
  return {
    save: function(key,data) {
      return $localForage.setItem(key,data);
    },
    retrieve: function(key){
      return $localForage.getItem(key)
    },
    getPatientStub:getPatientStub
  };
});
