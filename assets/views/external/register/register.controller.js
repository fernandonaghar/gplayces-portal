(function() {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$state', 'UserService', '$rootScope', 'FlashService'];

    function RegisterController($state, UserService, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;
        vm.resetPassword = resetPassword;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function(response) {
                    if (response.success) {
                        FlashService.Success('Registro realizado com sucesso, você já pode realizar login.', true);
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
                    FlashService.Success('Um e-mail foi enviado para sua caixa, por favor siga as instruções para realizar o reset da senha.', true);
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