(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesRequestAdminUserDataController', PlacesRequestAdminUserDataController);

    PlacesRequestAdminUserDataController.$inject = ['$scope', '$state', 'PlaceService', 'FlashService', '$stateParams', 'UserService'];

    function PlacesRequestAdminUserDataController($scope, $state, PlaceService, FlashService, $stateParams, UserService) {
        var userdata = this;
        userdata.place = $stateParams.place;
        userdata.parse_place = $stateParams.parse_place;
        userdata.saveUserData = saveUserData;
        userdata.user = $stateParams.user;
        userdata.user_info = $stateParams.user_info;

        function saveUserData() {
            userdata.dataLoading = true;
            UserService.SaveCurrentUser(userdata.user).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        UserService.SaveUserInfo(userdata.user_info).then(function(response) {
                            if (response != null) {
                                if (response.success) {
                                    userdata.dataLoading = false;
                                    $state.go('app.places.request_admin.request', { place: userdata.place, parse_place: userdata.parse_place });
                                } else {
                                    FlashService.Error(response.message);
                                    userdata.dataLoading = false;
                                }
                            };
                        }).catch(angular.noop);

                    } else {
                        FlashService.Error(response.message);
                        userdata.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };
    }

})();