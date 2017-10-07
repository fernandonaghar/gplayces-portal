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