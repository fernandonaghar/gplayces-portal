(function() {
    'use strict';

    angular
        .module('app')
        .factory('GeneralServices', GeneralServices);

    GeneralServices.$inject = ['$http', '$q', 'ParseObject', 'ParseQuery'];

    function GeneralServices($http, $q, ParseObject, ParseQuery) {
        var service = {};
        service.GetCities = GetCities;
        service.SearchCities = SearchCities;
        service.SaveCity = SaveCity;

        service.CityParseToAngularObject = CityParseToAngularObject;
        service.StateParseToAngularObject = StateParseToAngularObject;
        service.CountryParseToAngularObject = CountryParseToAngularObject;

        service.GetStates = GetStates;
        service.SearchStates = SearchStates;
        service.SaveState = SaveState;

        service.GetCountries = GetCountries;
        service.SearchCountries = SearchCountries;
        service.SaveCountry = SaveCountry;

        return service;

        function GetCities() {

            var deferred = $q.defer();
            var City = Parse.Object.extend("City");

            var query = new Parse.Query(City);
            query.include(["state", "state.country"]);
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

        function StateParseToAngularObject(parse_object) {

            var angular_object = [];
            angular_object.id = parse_object.id;
            angular_object.state = parse_object.attributes.state;
            if (parse_object.attributes.country != null) {
                angular_object.country = parse_object.attributes.country;
            }
            angular_object.parse_object = parse_object;

            return angular_object;
        }

        function CountryParseToAngularObject(parse_object) {

            var angular_object = [];
            angular_object.id = parse_object.id;
            angular_object.country = parse_object.attributes.country;
            angular_object.parse_object = parse_object;

            return angular_object;
        }

        function CityParseToAngularObject(parse_object) {

            var angular_object = [];
            angular_object.id = parse_object.id;
            angular_object.name = parse_object.attributes.name;
            angular_object.active = parse_object.attributes.active;

            if (parse_object.attributes.state != null) {
                angular_object.state = parse_object.attributes.state;
                angular_object.country = parse_object.attributes.state.attributes.country;
            }
            if (parse_object.attributes.location != null) {
                angular_object.latitude = Number(parse_object.attributes.location.latitude);
                angular_object.longitude = Number(parse_object.attributes.location.longitude);
            }
            angular_object.parse_object = parse_object;

            return angular_object;
        }

        function SaveCity(angular_object) {

            var deferred = $q.defer();
            var parse_object;

            if (angular_object.id == null) {
                var City = Parse.Object.extend("City");
                parse_object = new City();
            } else {
                parse_object = angular_object.parse_object;
            };
            parse_object.set("name", angular_object.name);
            parse_object.set("active", angular_object.active);
            if (angular_object.state != null) {
                parse_object.set("state", angular_object.state);
            }
            if (angular_object.latitude != null && angular_object.longitude != null) {
                var point = new Parse.GeoPoint({ latitude: angular_object.latitude, longitude: angular_object.longitude });
                parse_object.set("location", point);
            }
            parse_object.save(null, {
                success: function(parse_object) {
                    deferred.resolve({ success: true, object: parse_object });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function SaveState(angular_object) {

            var deferred = $q.defer();
            var parse_object;

            if (angular_object.id == null) {
                var State = Parse.Object.extend("State");
                parse_object = new State();
            } else {
                parse_object = angular_object.parse_object;
            };
            parse_object.set("state", angular_object.state);

            if (angular_object.country != null) {
                parse_object.set("country", angular_object.country);
            }
            parse_object.save(null, {
                success: function(parse_object) {
                    deferred.resolve({ success: true, object: parse_object });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function SaveCountry(angular_object) {

            var deferred = $q.defer();
            var parse_object;

            if (angular_object.id == null) {
                var Country = Parse.Object.extend("Country");
                parse_object = new Country();
            } else {
                parse_object = angular_object.parse_object;
            };
            parse_object.set("country", angular_object.country);

            parse_object.save(null, {
                success: function(parse_object) {
                    deferred.resolve({ success: true, object: parse_object });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function SearchCities(searchCountry, searchState, searchCity) {

            var deferred = $q.defer();
            var City = Parse.Object.extend("City");
            var query = new Parse.Query(City);

            if (searchCountry != null) {
                var State = Parse.Object.extend("State");
                var innerQuery = new Parse.Query(State);
                innerQuery.equalTo("country", searchCountry);
                query.matchesQuery("state", innerQuery);
            }
            if (searchState != null && searchState != "") {
                query.equalTo("state", searchState);
            }
            if (searchCity != null && searchCity != "") {
                query.matches("name", searchCity);
            }

            query.include(["state", "state.country"]);
            query.find({
                success: function(results) {
                    if (results.length > 0) {
                        deferred.resolve({ success: true, parse_info: results });
                    } else {
                        deferred.resolve({ success: true, parse_info: [] });
                    }
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function SearchStates(searchCountry, searchState) {

            var deferred = $q.defer();
            var State = Parse.Object.extend("State");
            var query = new Parse.Query(State);

            if (searchCountry != null) {
                query.equalTo("country", searchCountry);
            }
            if (searchState != null && searchState != "") {
                query.matches("state", searchState);
            }

            query.include(["country"]);
            query.find({
                success: function(results) {
                    if (results.length > 0) {
                        deferred.resolve({ success: true, parse_info: results });
                    } else {
                        deferred.resolve({ success: true, parse_info: [] });
                    }
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetStates(searchCountry) {

            var deferred = $q.defer();
            var State = Parse.Object.extend("State");
            var query = new Parse.Query(State);

            if (searchCountry != null) {
                query.equalTo("country", searchCountry);
            }

            query.include(["country"]);
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

        function SearchCountries(searchCountry) {

            var deferred = $q.defer();
            var Country = Parse.Object.extend("Country");
            var query = new Parse.Query(Country);

            if (searchCountry != null && searchCountry != "") {
                query.matches("country", searchCountry);
            }
            query.find({
                success: function(results) {
                    if (results.length > 0) {
                        deferred.resolve({ success: true, parse_info: results });
                    } else {
                        deferred.resolve({ success: true, parse_info: [] });
                    }
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetCountries() {

            var deferred = $q.defer();
            var Country = Parse.Object.extend("Country");

            var query = new Parse.Query(Country);
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