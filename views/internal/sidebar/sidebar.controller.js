(function() {
    'use strict';

    angular
        .module('app')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$scope', 'UserService', '$rootScope'];

    function SidebarController($scope, UserService, $rootScope) {
        var vm = this;
        vm.user = UserService.GetCurrentUser();

        $rootScope.isAdmin = vm.user.isAdmin;
        vm.profileURL = UserService.GetProfilePhotoURL();

        $scope.$watch(function() { return UserService.GetProfilePhotoURL(); },
            function(value) {
                vm.profileURL = value;
            }
        );

    }

})();