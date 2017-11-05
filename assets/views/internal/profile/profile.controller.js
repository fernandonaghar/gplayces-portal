(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$state', 'UserService', '$scope', 'FlashService', 'GeneralServices'];

    function ProfileController($state, UserService, $scope, FlashService, GeneralServices) {
        var profile = this;
        profile.saveUserData = saveUserData;
        profile.saveAddressData = saveAddressData;

        initController();

        function initController() {
            profile.user = UserService.GetCurrentUser();

            // Get User profile Data
            UserService.GetCurrentUserInfo().then(function(response) {
                if (response != null) {
                    profile.userinfo = response.info;
                };
            }).catch(angular.noop);

            // Get Cities list
            GeneralServices.GetCities().then(function(response) {
                if (response != null) {
                    profile.cities = response.parse_info;
                };
            }).catch(angular.noop);
        }

        function saveUserData() {
            profile.dataLoading = true;
            UserService.SaveCurrentUser(profile.user).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        UserService.SaveUserInfo(profile.userinfo).then(function(response) {
                            if (response != null) {
                                if (response.success) {
                                    profile.dataLoading = false;
                                    $state.go('app.profile.address');
                                } else {
                                    FlashService.Error(response.message);
                                    profile.dataLoading = false;
                                }
                            };
                        }).catch(angular.noop);
                    } else {
                        FlashService.Error(response.message);
                        profile.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };

        function saveAddressData() {
            profile.dataLoading = true;
            UserService.SaveUserInfo(profile.userinfo).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        profile.dataLoading = false;
                        $state.go('app.profile.photo');
                    } else {
                        FlashService.Error(response.message);
                        profile.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };

    }

})();