﻿(function() {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$state', 'UserService', '$rootScope', 'FlashService'];

    function RegisterController($state, UserService, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;

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
    }

})();