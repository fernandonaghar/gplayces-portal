(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesEditController', PlacesEditController);

    PlacesEditController.$inject = ['$state', '$rootScope', 'PlaceService', 'GeneralServices', 'FlashService', '$stateParams', '$timeout', 'UserService'];

    function PlacesEditController($state, $rootScope, PlaceService, GeneralServices, FlashService, $stateParams, $timeout, UserService) {
        var edit = this;
        edit.savePlaceData = savePlaceData;
        edit.isNewRecord = true;

        initController();

        function initController() {

            edit.disabledCategories = true;
            PlaceService.GetPlaceCategories()
                .then(function(response) {
                    if (response != null) {
                        edit.categories = response.parse_data;
                        edit.disabledCategories = false;
                    };
                }).catch(angular.noop);

            edit.disabledCities = true;
            GeneralServices.GetCities().then(function(response) {
                if (response != null) {
                    edit.cities = response.parse_info;
                    edit.disabledCities = false;
                };
            }).catch(angular.noop);

            // define input place
            if ($stateParams.parse_place != null) {
                edit.place = PlaceService.ParseToAngularObject($stateParams.parse_place);
                edit.isNewRecord = false;
            } else if ($stateParams.place != null) {
                edit.place = $stateParams.place;
                edit.isNewRecord = false;
            }
        }

        function isNewRecord() {
            if (edit.place.id != null) {
                return false;
            } else {
                return true;
            }
        }

        function savePlaceData() {
            edit.dataLoading = true;
            PlaceService.SavePlace(edit.place).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        edit.dataLoading = false;
                        edit.place = PlaceService.ParseToAngularObject(response.place);
                        edit.isNewRecord = false;

                        if ($state.current.name == 'app.places.edit.data') {
                            $state.go('app.places.edit.address', { place: edit.place });
                        } else if ($state.current.name == 'app.places.edit.contact') {
                            $state.go('app.places.edit.hours', { place: edit.place });
                        }

                    } else {
                        FlashService.Error(response.message);
                        edit.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };
    }

})();