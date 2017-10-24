(function() {
    'use strict';

    angular
        .module('app')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$scope', 'UserService'];

    function SidebarController($scope, UserService) {
        var vm = this;
        vm.user = UserService.GetCurrentUser();
        vm.profileURL = UserService.GetProfilePhotoURL();

        $scope.$watch(function() { return UserService.GetProfilePhotoURL(); },
            function(value) {
                vm.profileURL = value;
            }
        );

    }

})();