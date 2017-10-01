(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['UserService', '$scope', '$location', 'FlashService'];

    function ProfileController(UserService, $scope, $location, FlashService) {
        var profile = this;
        profile.saveUserData = saveUserData;
        profile.saveAddressData = saveAddressData;

        initController();

        function initController() {
            $location.path('profile/personal');
            profile.user = UserService.GetCurrentUser();
            UserService.GetCurrentUserAddress().then(function(response) {
                if (response != null) {
                    profile.address = response.address;
                };
            }).catch(angular.noop);;
        }

        function saveUserData() {
            profile.dataLoading = true;
            UserService.SaveCurrentUser(profile.user).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        profile.dataLoading = false;
                        $location.path('profile/address');
                    } else {
                        FlashService.Error(response.message);
                        profile.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };

        function saveAddressData() {
            profile.dataLoading = true;
            UserService.SaveAddressData(profile.address).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        profile.dataLoading = false;
                        FlashService.Success('Dados atualizados com sucesso!', true);
                    } else {
                        FlashService.Error(response.message);
                        profile.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };

    }

})();