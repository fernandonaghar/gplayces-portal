(function() {
    'use strict';

    angular
        .module('app')
        .factory('PlaceService', PlaceService);

    PlaceService.$inject = ['$http', '$q'];

    function PlaceService($http, $q) {
        var service = {};
        service.GetCreatedPlaces = GetCreatedPlaces;
        service.GetOwnedPlaces = GetOwnedPlaces;
        service.GetPlaceCategories = GetPlaceCategories;
        service.SavePlace = SavePlace;
        service.ParseToAngularObject = ParseToAngularObject;
        return service;

        function GetCreatedPlaces() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Place = Parse.Object.extend("Place");

            var query = new Parse.Query(Place);
            query.equalTo("creator", parse_user);
            query.equalTo("owner", null);
            query.include(["city", "category"]);
            query.descending("createdAt");
            query.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetOwnedPlaces() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Place = Parse.Object.extend("Place");

            var query = new Parse.Query(Place);
            query.equalTo("owner", parse_user);
            query.include(["city", "category"]);
            query.descending("createdAt");
            query.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetPlaceById(id) {

            var deferred = $q.defer();
            var Place = Parse.Object.extend("Place");
            var query = new Parse.Query(Place);
            query.include(["city", "category"]);
            query.get(id, {
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetPlaceCategories() {

            var deferred = $q.defer();
            var Category = Parse.Object.extend("Category");
            var query = new Parse.Query(Category);
            query.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function SavePlace(place) {

            var deferred = $q.defer();
            var parse_object;

            if (place.id != null) {
                GetPlaceById(place.id).then(function(response) {
                    if (response != null) {
                        if (response.parse_data != null) {
                            parse_object = response.parse_data;
                            parse_object = SetPlaceData(place, parse_object);
                            parse_object.save(null, {
                                success: function(parse_object) {
                                    deferred.resolve({ success: true, place: parse_object });
                                },
                                error: function(parse_user, error) {
                                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                                }
                            }).catch(angular.noop);
                        } else {
                            var Place = Parse.Object.extend("Place");
                            parse_object = new Place();
                            var parse_user = Parse.User.current();
                            parse_object.set("creator", parse_user);
                            parse_object = SetPlaceData(place, parse_object);
                            parse_object.save(null, {
                                success: function(parse_object) {
                                    deferred.resolve({ success: true, place: parse_object });
                                },
                                error: function(parse_object, error) {
                                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                                }
                            }).catch(angular.noop);
                        }
                    }
                }).catch(angular.noop);
            } else {
                var Place = Parse.Object.extend("Place");
                parse_object = new Place();
                var parse_user = Parse.User.current();
                parse_object.set("creator", parse_user);
                parse_object = SetPlaceData(place, parse_object);
                parse_object.save(null, {
                    success: function(parse_object) {
                        deferred.resolve({ success: true, place: parse_object });
                    },
                    error: function(parse_user, error) {
                        deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                    }
                }).catch(angular.noop);
            }
            return deferred.promise;
        }

        function SetPlaceData(place, parse_object) {

            parse_object.set("name", place.name);
            parse_object.set("city", place.city);
            parse_object.set("category", place.category);
            parse_object.set("descriptionPT", place.descriptionPT);
            parse_object.set("descriptionEN", place.descriptionEN);
            parse_object.set("descriptionES", place.descriptionES);
            parse_object.set("address", place.address);
            parse_object.set("email", place.email);
            parse_object.set("instagram", place.instagram);
            parse_object.set("twitter", place.twitter);
            parse_object.set("facebook", place.facebook);
            parse_object.set("site", place.site);
            parse_object.set("address", place.address);

            if (place.latitude != null && place.longitude != null) {
                var point = new Parse.GeoPoint({ latitude: place.latitude, longitude: place.longitude });
                parse_object.set("location", point);
            }

            return parse_object;
        }

        function ParseToAngularObject(parse_object) {

            var angular_object = [];
            angular_object.id = parse_object.id;
            angular_object.name = parse_object.attributes.name;
            angular_object.city = parse_object.attributes.city;
            angular_object.category = parse_object.attributes.category;
            angular_object.descriptionPT = parse_object.attributes.descriptionPT;
            angular_object.descriptionEN = parse_object.attributes.descriptionEN;
            angular_object.descriptionES = parse_object.attributes.descriptionES;
            angular_object.email = parse_object.attributes.email;
            angular_object.instagram = parse_object.attributes.instagram;
            angular_object.twitter = parse_object.attributes.twitter;
            angular_object.facebook = parse_object.attributes.facebook;
            angular_object.site = parse_object.attributes.site;
            angular_object.location = parse_object.attributes.location;

            if (parse_object.attributes.location != null) {
                angular_object.latitude = Number(parse_object.attributes.location.latitude);
                angular_object.longitude = Number(parse_object.attributes.location.longitude);
            }
            angular_object.address = parse_object.attributes.address;
            angular_object.parse_object = parse_object;

            return angular_object;
        }
    }

})();