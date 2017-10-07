(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesController', PlacesController);

    PlacesController.$inject = ['$scope', '$state', '$rootScope', 'PlaceService', 'FlashService'];

    function PlacesController($scope, $state, $rootScope, PlaceService, FlashService) {
        var vm = this;
        vm.dataLoading = true;
        vm.owned_places = [];
        vm.filteredPlaces = [];
        vm.owned_places = [];
        vm.currentPage = 1;
        vm.numPerPage = 6;

        initController();

        function initController() {

            PlaceService.GetOwnedPlaces()
                .then(function(response) {
                    if (response != null) {
                        if (response.parse_data.length > 0) {
                            vm.owned_places = response.parse_data;
                            var begin = ((vm.currentPage - 1) * vm.numPerPage),
                                end = begin + vm.numPerPage;

                            vm.filteredPlaces = vm.owned_places.slice(begin, end);
                        } else {
                            vm.noOwnedPlacesFound = true;
                        };
                    };
                    vm.dataLoading = false;
                }).catch(angular.noop);
        }

        $scope.$watch('vm.currentPage + vm.numPerPage', function() {
            var begin = ((vm.currentPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;

            vm.filteredPlaces = vm.owned_places.slice(begin, end);
        });
    }

})();