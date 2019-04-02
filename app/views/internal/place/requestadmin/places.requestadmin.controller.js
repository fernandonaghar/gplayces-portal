(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesRequestAdminRedirectController', PlacesRequestAdminRedirectController);

    PlacesRequestAdminRedirectController.$inject = ['$scope', '$state', 'PlaceService', 'FlashService', '$stateParams', 'UserService'];

    function PlacesRequestAdminRedirectController($scope, $state, PlaceService, FlashService, $stateParams, UserService) {
        var request = this;
        request.place = [];
        request.user = [];
        request.user_info = [];

        initController();

        function initController() {

            // define input place
            if ($stateParams.parse_place != null || $stateParams.place != null) {
                if ($stateParams.parse_place != null) {
                    request.place = PlaceService.ParseToAngularObject($stateParams.parse_place);
                    request.parse_place = $stateParams.parse_place;
                } else if ($stateParams.place != null) {
                    request.place = $stateParams.place;
                }
                request.user = UserService.GetCurrentUser();
                request.dataLoading = true;
                UserService.GetCurrentUserInfo()
                    .then(function(response) {
                        request.dataLoading = false;
                        if (response != null) {
                            if (response.success) {
                                request.user_info = response.info;
                                if (request.user.firstName != null && request.user.firstName != '' &&
                                    request.user.lastName != null && request.user.lastName != '' &&
                                    request.user.document != null && request.user.document != '' &&
                                    request.user_info.phone != null && request.user_info.phone != '') {
                                    $state.go('app.places.request_admin.request', { place: request.place, parse_place: request.parse_place, user: request.user, user_info: request.user_info });
                                } else {
                                    $state.go('app.places.request_admin.userdata', { place: request.place, parse_place: request.parse_place, user: request.user, user_info: request.user_info });
                                }
                            } else {
                                FlashService.Error(response.message);
                                $state.go('app.places.created');
                            }
                        };
                    });
            } else {
                $state.go('app.places.myplaces');
            };
        }
    }

})();