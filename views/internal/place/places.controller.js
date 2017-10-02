(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesController', PlacesController);

    PlacesController.$inject = ['$state', '$rootScope', 'PlaceService'];

    function PlacesController($state, $rootScope, PlaceService) {
        var vm = this;
        vm.dataLoading = true;
        vm.new_place = [];

        initController();

        function initController() {

            PlaceService.GetPlaces()
                .then(function(response) {
                    if (response != null) {
                        if (response.parse_data.length > 0) {
                            vm.places = response.parse_data;
                        } else {
                            vm.noPlacesFound = true;
                        };
                    };
                    vm.dataLoading = false;
                })
        }
    }

})();