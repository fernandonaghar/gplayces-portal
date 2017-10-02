(function() {
    'use strict';

    angular
        .module('app')
        .factory('GeneralServices', GeneralServices);

    GeneralServices.$inject = ['$http', '$q', 'ParseObject', 'ParseQuery'];

    function GeneralServices($http, $q, ParseObject, ParseQuery) {
        var service = {};
        service.GetCities = GetCities;

        return service;

        function GetCities() {

            //create new contact record from parse object instance
            // var Contact = Parse.Object.extend('Contact');
            // $scope.newContact = new ParseObject(new Contact(), ['firstName', 'lastName', 'email']);

            // query angular object
            // var query = new Parse.Query(Parse.Object.extend('Contact'));
            // ParseQuery(query, {functionToCall:'first'}).then(function(obj){
            //     $scope.newContact = new ParseObject(obj, ['firstName','lastName','email']);
            // });
            var deferred = $q.defer();
            var City = Parse.Object.extend("City");

            var query = new Parse.Query(City);
            query.include(["city", "city.state", "city.state.country"]);
            query.find({
                success: function(results) {
                    if (results.length > 0) {
                        deferred.resolve({ success: true, parse_info: results });
                    } else {
                        deferred.resolve({ success: true, parse_info: null });
                    }
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }
    }

})();