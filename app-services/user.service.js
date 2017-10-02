(function() {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$q'];

    function UserService($http, $q) {
        var service = {};
        service.GetCurrentUser = GetCurrentUser;
        service.GetCurrentUserInfo = GetCurrentUserInfo;
        service.Create = Create;
        service.SaveCurrentUser = SaveCurrentUser;
        service.SaveUserInfo = SaveUserInfo;

        return service;

        function GetCurrentUser() {

            var parse_user = Parse.User.current();

            var userObject = [];
            userObject.username = parse_user.attributes.username;
            userObject.firstName = parse_user.attributes.firstName;
            userObject.lastName = parse_user.attributes.lastName;
            userObject.birthday = parse_user.attributes.birthday;
            userObject.document = parse_user.attributes.document;
            userObject.email = parse_user.attributes.email;
            return userObject;
        }

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

        function GetCurrentUserInfo() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Userinfo = Parse.Object.extend("UserInfo");

            var query = new Parse.Query(Userinfo);
            query.equalTo("user", parse_user);
            query.include(["city"]);
            query.find({
                success: function(results) {
                    if (results.length > 0) {
                        var parse_info = results[0];
                        var info = [];

                        info.city = parse_info.attributes.city;
                        info.address = parse_info.attributes.address;
                        info.complement = parse_info.attributes.complement;
                        info.zipcode = parse_info.attributes.zipcode;

                        deferred.resolve({ success: true, info: info, parse_info: parse_info });
                    } else {
                        deferred.resolve({ success: true, info: null });
                    }
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