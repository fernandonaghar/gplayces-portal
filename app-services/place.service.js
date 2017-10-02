(function() {
    'use strict';

    angular
        .module('app')
        .factory('PlaceService', PlaceService);

    PlaceService.$inject = ['$http', '$q'];

    function PlaceService($http, $q) {
        var service = {};
        service.GetPlaces = GetPlaces;

        return service;

        function SaveCurrentUser(user) {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();

            if (parse_user.attributes.username == parse_user.attributes.email) {
                parse_user.set("username", user.email);
            }
            parse_user.set("email", user.email);
            parse_user.set("firstName", user.firstName);
            parse_user.set("lastName", user.lastName);
            parse_user.set("birthday", user.birthday);
            parse_user.set("document", user.document);

            parse_user.save(null, {
                success: function(parse_user) {
                    deferred.resolve({ success: true });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetPlaces() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Place = Parse.Object.extend("Place");

            var query = new Parse.Query(Place);
            //query.equalTo("user", parse_user);
            query.include(["city", "category"]);
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

        function SaveUserInfo(info) {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var parse_info;

            var current_info = GetCurrentUserInfo().then(function(response) {
                if (response != null) {
                    if (response.parse_info != null)
                        parse_info = response.parse_info;
                    else {
                        var Userinfo = Parse.Object.extend("UserInfo");
                        parse_info = new Userinfo();
                    }

                    parse_info.set("zipcode", info.zipcode);
                    parse_info.set("city", info.city);
                    parse_info.set("address", info.address);
                    parse_info.set("complement", info.complement);
                    parse_info.set("user", parse_user);
                    parse_info.save(null, {
                        success: function(parse_user) {
                            deferred.resolve({ success: true });
                        },
                        error: function(parse_user, error) {
                            deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                        }
                    });

                };
            }).catch(angular.noop);
            return deferred.promise;
        }

        function Create(user) {

            var deferred = $q.defer();

            var parse_user = new Parse.User();
            parse_user.set("username", user.username);
            parse_user.set("password", user.password);
            parse_user.set("email", user.username);
            parse_user.set("lastName", user.lastName);
            parse_user.set("firstName", user.firstName);

            parse_user.signUp(null, {
                success: function(parse_user) {
                    deferred.resolve({ success: true });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });

            return deferred.promise;
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function() {
                return { success: false, message: error };
            };
        }
    }

})();