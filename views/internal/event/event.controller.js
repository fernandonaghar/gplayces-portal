(function() {
    'use strict';

    angular
        .module('app')
        .controller('EventController', EventController);

    EventController.$inject = ['UserService', '$rootScope'];

    function EventController(UserService, $rootScope) {
        var vm = this;
        vm.title = 'Eventos';
        vm.user = null;

        initController();

        function initController() {
            loadCurrentUser();
        }

        function loadCurrentUser() {}
    }

})();