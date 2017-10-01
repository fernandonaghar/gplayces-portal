(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService', '$q'];

    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService, $q) {
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
                    deferred.resolve({ success: false, message: 'Login pelo facebook falhou, se desejar, você pode realizar a criação de uma conta a partir de seu e-mail e posteriormente associar sua conta do facebook.' });
                }
            });

            return deferred.promise;
        }

        function Login(username, password, callback) {

            var deferred = $q.defer();

            Parse.User.logIn(username, password, {
                success: function(user) {
                    deferred.resolve({ success: true });
                },
                error: function(user, error) {
                    deferred.resolve({ success: false, message: 'E-mail e/ou senha inválidos.' });
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