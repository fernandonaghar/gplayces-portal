(function() {
    'use strict';

    angular
        .module('app')
        .controller('EventController', EventController);

    PlacesController.$inject = ['UserService', '$rootScope'];

    function EventController(UserService, $rootScope) {
        var vm = this;
        vm.title = 'Eventos';
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