(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesController', PlacesController);

    PlacesController.$inject = ['UserService', '$rootScope'];

    function PlacesController(UserService, $rootScope) {
        var vm = this;
        vm.title = 'Meus locais';
        vm.user = null;

        initController();

        function initController() {
            loadCurrentUser();
        }

        function loadCurrentUser() {

            var user = UserService.GetCurrentUser();
            vm.user = user;
        };
    }

})();