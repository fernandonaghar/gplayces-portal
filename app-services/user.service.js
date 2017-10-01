(function() {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$q'];

    function UserService($http, $q) {
        var service = {};
        service.GetCurrentUser = GetCurrentUser;
        service.GetCurrentUserAddress = GetCurrentUserAddress;
        service.Create = Create;
        service.SaveCurrentUser = SaveCurrentUser;
        service.SaveAddressData = SaveAddressData;
        GetCurrentUserAddress;

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

        function GetCurrentUserAddress() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var UserAddress = Parse.Object.extend("UserAddress");

            var query = new Parse.Query(UserAddress);
            query.equalTo("user", parse_user);
            query.find({
                success: function(results) {
                    if (results.length > 0) {
                        var parse_address = results[0];
                        var address = [];

                        address.city = parse_address.attributes.city;
                        address.state = parse_address.attributes.state;
                        address.address = parse_address.attributes.address;
                        address.complement = parse_address.attributes.complement;
                        address.zipcode = parse_address.attributes.zipcode;

                        deferred.resolve({ success: true, address: address, parse_address: parse_address });
                    } else {
                        deferred.resolve({ success: true, address: null });
                    }
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function SaveAddressData(address) {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var parse_address;

            var current_address = GetCurrentUserAddress().then(function(response) {
                if (response != null) {
                    if (response.parse_address != null)
                        parse_address = response.parse_address;
                    else {
                        var UserAddress = Parse.Object.extend("UserAddress");
                        parse_address = new UserAddress();
                    }

                    parse_address.set("zipcode", address.zipcode);
                    parse_address.set("city", address.city);
                    parse_address.set("state", address.state);
                    parse_address.set("address", address.address);
                    parse_address.set("complement", address.complement);
                    parse_address.set("user", parse_user);
                    parse_address.save(null, {
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