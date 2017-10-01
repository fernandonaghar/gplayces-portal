(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['UserService', '$rootScope'];

    function DashboardController(UserService, $rootScope) {
        var vm = this;

        vm.title = 'Dashboard';
        vm.user = null;

        initController();

        function initController() {}

    }

})();