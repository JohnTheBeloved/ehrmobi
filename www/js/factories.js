angular.module('starter.factories', [])

.factory('DataFactory', function($localForage,$q) {

  var getPatientStub = function(firstName,middleName,lastName,
    dateOfBirth,gender,email,phone,password,imageBase64)
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
  };

  var appendProperty = function(key,property,value){
      var appended = $q.defer();
       $localForage.getItem(key).then(function(object){
            object[property] = value;
            $localForage.setItem(key,object).then(function(){
              appended.resolve(true);
            })
       })

      return appended.promise;
  }
  
  return {
    save: function(key,data) {
      return $localForage.setItem(key,data);
    },
    retrieve: function(key){
      return $localForage.getItem(key)
    },
    getPatientStub:getPatientStub,
    appendProperty:appendProperty 
  };
})


.factory('OpenMRSAPIModelFactory', function() {

    var personStub = function(givenName,familyName,middleName,
        dateOfBirth, gender,phoneNumber,
        lineOne, lineTwo,city, state,base64Image,
        weight,height
      ){
        return {
          "names":[
            {
              "givenName":givenName,
              "familyName":familyName,
              "middleName":middleName,
              "preferred":"true",
              "familyName2":null,
              "prefix":null,
              "familyNamePrefix":null,
              "familyNameSuffix":null,
              "degree":null
            }
          ],
          "gender":gender,
          "age":null,
          "birthdate":dateOfBirth,//"2016-08-22"
          "birthdateEstimated":false,
          "dead":false,
          "deathDate":null,
          "causeOfDeath":null,
          "addresses":[
            {
              "preferred":null,
              "address1":lineOne,
              "address2":lineTwo,
              "cityVillage":"Ibadan",
              "stateProvince":state,
              "country":"Nigeria",
              "postalCode":"200056",
              "latitude":"7.377535",
              "longitude":"3.947040",
              "countyDistrict":"Not Specified",
              "address3":null,
              "address4":null,
              "address5":null,
              "address6":null,
              "startDate":null,
              "endDate":null
            }
          ],
          "attributes":[
            // {
            //   "attributeType":{
            //     "uuid":"d57e78c7-b32a-43f4-ad6a-5678c57df8c2",
            //     //"name":"Passport Image"
            //   },
            //   "value":base64Image
            // },
            {
              "attributeType":{
                "uuid":"8d8718c2-c2cc-11de-8d13-0010c6dffd0f",
                //"name":"Phone Number"
              },
              "value":phoneNumber
            },
            {
              "attributeType":{
                "uuid":"18eb38bc-5827-4354-84e7-316a6d102656",
                //"name":"Registration Weight"
              },
              "value":weight.toString()
            },
            {
              "attributeType":{
                "uuid":"9bd3b982-d0c2-4950-9cb0-e461e5d4102a",
                //"name":"Registration Height"
              },
              "value":height.toString()
            }
          ]
        };
    };

    var patientStub = function(personUUID,phoneNumber){
        return {
                  "identifiers":[
                      {
                        "identifierType":{
                          "uuid":"eb9a5a69-5e59-4273-a7a6-8566d6ee8067",
                          //"name":"Phone Number"
                        },
                        "identifier":phoneNumber
                      } 
                  ],
                  "person":{
                    "uuid":"personUUID"
                  }

                };
    };


    return{
      getPatientStub : patientStub,
      getPersonStub : personStub
    }

});