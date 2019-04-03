(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesEditController', PlacesEditController);

    PlacesEditController.$inject = ['$state', '$rootScope', '$translate', 'PlaceService', 'GeneralServices', 'FlashService', '$stateParams', '$timeout', 'UserService'];

    function PlacesEditController($state, $rootScope, $translate, PlaceService, GeneralServices, FlashService, $stateParams, $timeout, UserService) {
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
                if ($stateParams.place.attributes) {
                    edit.place = PlaceService.ParseToAngularObject($stateParams.place);
                }
                else
                {
                    edit.place = $stateParams.place;
                }
                edit.isNewRecord = false;

            // if no input place found and not place creation mode, redirect to my places
            } else if ($state.current.name != 'app.places.edit.data') {
                $state.go('app.places.myplaces');
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

            if ($state.current.name == 'app.places.edit.activation' && edit.place.isActive == true &&
                (edit.place.thumbnail == null || edit.place.thumbnail == "" || !edit.place.location)) {
                    
                if (!edit.place.location) {
                    FlashService.Error($translate.instant('PLACE_ADDRESS_REQUIRED'));
                }
                else 
                {
                    FlashService.Error($translate.instant('THUMBNAIL_REQUIRED'));
                }                  
            }
            else
            {
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
                            } else if ($state.current.name == 'app.places.edit.activation') {
                                $state.go('app.places.myplaces');
                            }

                        } else {
                            FlashService.Error(response.message);
                            edit.dataLoading = false;
                        }
                    };
                }).catch(angular.noop);
            }
        };
    }

})();