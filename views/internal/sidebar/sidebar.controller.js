(function() {
    'use strict';

    angular
        .module('app')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope'];

    function SidebarController($rootScope) {
        var vm = this;
        vm.user = Parse.User.current();
    }

})();