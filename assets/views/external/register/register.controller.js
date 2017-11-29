(function() {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$state', 'UserService', '$rootScope', 'FlashService', '$translate'];

    function RegisterController($state, UserService, $rootScope, FlashService, $translate) {
        var vm = this;

        vm.register = register;
        vm.resetPassword = resetPassword;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success($translate.instant('REGISTRATION_SUCCESSFUL'), true);
                        $state.go('login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function resetPassword() {
            vm.dataLoading = true;
            Parse.User.requestPasswordReset(vm.lostpasswordemail, {
                success: function() {
                    FlashService.Success($translate.instant('PASSWORD_RESET_MESSAGE'), true);
                    vm.dataLoading = false;
                },
                error: function(error) {
                    FlashService.Error(error.code + " " + error.message);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();