(function() {
    'use strict';

    angular
        .module('app')
        .controller('CreatedPlacesController', CreatedPlacesController);

    CreatedPlacesController.$inject = ['$scope', '$state', '$rootScope', 'PlaceService', 'FlashService'];

    function CreatedPlacesController($scope, $state, $rootScope, PlaceService, FlashService) {
        var vm = this;
        vm.dataLoading = true;
        vm.filteredPlaces = [];
        vm.created_places = [];
        vm.currentPage = 1;
        vm.numPerPage = 6;

        initController();

        function initController() {

            PlaceService.GetCreatedPlaces()
                .then(function(response) {
                    if (response != null) {
                        if (response.parse_data.length > 0) {
                            vm.created_places = response.parse_data;
                            var begin = ((vm.currentPage - 1) * vm.numPerPage),
                                end = begin + vm.numPerPage;

                            vm.filteredPlaces = vm.created_places.slice(begin, end);
                        } else {
                            vm.noCreatedPlacesFound = true;
                        };
                    };
                    vm.dataLoading = false;
                }).catch(angular.noop);
        }

        $scope.$watch('vm.currentPage + vm.numPerPage', function() {
            var begin = ((vm.currentPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;

            vm.filteredPlaces = vm.created_places.slice(begin, end);
        });
    }

})();