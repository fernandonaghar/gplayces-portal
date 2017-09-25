﻿(function() {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];

    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;
        vm.login_facebook = login_facebook;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;

            AuthenticationService.Login(vm.username, vm.password)
                .then(function(response) {
                    if (response != null) {
                        if (response.success) {
                            AuthenticationService.SetCredentials(vm.username, vm.password);
                            $location.path('/');
                        } else {
                            FlashService.Error(response.message);
                            vm.dataLoading = false;
                        }
                    };
                });

        };

        function login_facebook() {
            Parse.FacebookUtils.logIn(null, {
                success: function(user) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                },
                error: function(user, error) {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();