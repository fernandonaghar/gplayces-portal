(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService', '$q', '$translate'];

    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService, $q, $translate) {
        var service = {};

        service.Login = Login;
        service.ClearCredentials = ClearCredentials;
        service.LoginFacebook = LoginFacebook;
        return service;

        function LoginFacebook() {

            var deferred = $q.defer();

            Parse.FacebookUtils.logIn("public_profile,email", {
                success: function(user) {
                    deferred.resolve({ success: true, user_id: user.id });
                },
                error: function(user, error) {
                    deferred.resolve({ success: false, message: $translate.instant('FACEBOOK_LOGIN_FAILED') });
                }
            });

            return deferred.promise;
        }

        function Login(username, password, callback) {

            var deferred = $q.defer();

            Parse.User.logIn(username, password, {
                success: function(user) {
                    
                    var queryRole = new Parse.Query(Parse.Role);
                    queryRole.equalTo('name', 'admin');
                    queryRole.first({
                        success: function(result) { // Role Object
                    
                            var role = result;
                            var adminRelation = new Parse.Relation(role, 'users');
                            var queryAdmins = adminRelation.query();
                    
                            queryAdmins.equalTo('objectId', Parse.User.current().id);
                            queryAdmins.first({
                                success: function(result) {    // User Object
                                    debugger
                                    var isAdmin = false;
                                    if (result)
                                    {
                                        isAdmin = true;
                                        UserService.SetAdminRole(isAdmin);
                                    }
                                    deferred.resolve({ success: true, user_id: user.id, admin: isAdmin });
                                },
                                error: function(error) {
                                    console.log("Error: Admin check failed.");
                                    deferred.resolve({ success: true, user_id: user.id, admin: false });
                                }
                            });
                        },
                        error: function(error) {
                            console.log("ERROR: ADMIN ROLE NOT FOUND");
                        }
                    }).then(function() {
                        console.log('After test: Auth = ' + authorized);
                    });
                },
                error: function(user, error) {
                    deferred.resolve({ success: false, message: $translate.instant('INVALID_EMAIL_OR_PWD') });
                }
            });

            return deferred.promise;
        }

        function ClearCredentials() {
            //assync
            Parse.User.logOut().then(() => {
                var currentUser = Parse.User.current();
            }).catch(angular.noop);

        }
    }

})();