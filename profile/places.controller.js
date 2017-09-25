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
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function(user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function(users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
                .then(function() {
                    loadAllUsers();
                });
        }
    }

})();