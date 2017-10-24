(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesEditImagesController', PlacesEditImagesController);

    PlacesEditImagesController.$inject = ['$state', '$rootScope', 'PlaceService', 'FlashService', '$stateParams'];

    function PlacesEditImagesController($state, $rootScope, PlaceService, FlashService, $stateParams) {
        var editimages = this;
        editimages.advanceFlow = advanceFlow;
        editimages.isNewRecord = true;
        editimages.photoGallery = [];

        initController();

        function initController() {

            // define input place
            if ($stateParams.parse_place != null) {
                editimages.place = PlaceService.ParseToAngularObject($stateParams.parse_place);
                editimages.isNewRecord = false;
            } else if ($stateParams.place != null) {
                editimages.place = $stateParams.place;
                editimages.isNewRecord = false;
            } else {
                $state.go('app.places.myplaces');
            }
        }

        function advanceFlow() {
            $state.go('app.places.myplaces');
        };
    }

})();