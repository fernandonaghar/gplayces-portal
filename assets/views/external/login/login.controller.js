(function() {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'AuthenticationService', 'FlashService', 'AzureStorageService'];

    function LoginController($state, AuthenticationService, FlashService, AzureStorageService) {
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
                            AzureStorageService.loadConfig()
                                .then(function(response) {
                                    $state.go('app.dashboard');
                                }).catch(angular.noop);
                        } else {
                            FlashService.Error(response.message);
                            vm.dataLoading = false;
                        }
                    };
                }).catch(angular.noop);

        };

        function login_facebook() {
            vm.dataLoading = true;

            AuthenticationService.LoginFacebook()
                .then(function(response) {
                    if (response != null) {
                        if (response.success) {
                            $state.go('app.dashboard');
                        } else {
                            FlashService.Error(response.message);
                            vm.dataLoading = false;
                        }
                    };
                }).catch(angular.noop);
        };
    }

})();