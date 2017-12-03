(function() {
    'use strict';

    angular
        .module('app')
        .controller('CreatedPlacesController', CreatedPlacesController);

    CreatedPlacesController.$inject = ['$scope', '$state', '$rootScope', 'PlaceService', 'FlashService', 'GeneralServices', '$translate'];

    function CreatedPlacesController($scope, $state, $rootScope, PlaceService, FlashService, GeneralServices, $translate) {
        var vm = this;
        vm.SearchPlaces = SearchPlaces;
        vm.dataLoading = true;
        vm.filteredPlaces = [];
        vm.created_places = [];
        vm.currentPage = 1;
        vm.numPerPage = 12;

        vm.searchLoading = false;
        vm.SearchPerformed = false;
        vm.filteredSearchedPlaces = [];
        vm.searchedPlaces = [];
        vm.currentSearchPage = 1;
        vm.numSearchPerPage = 6;

        vm.currentLanguage = $translate.use();

        vm.searchcategorylist = [
            { 'id': '0', 'criteria': $translate.instant('NAME') },
            { 'id': '1', 'criteria': $translate.instant('ADDRESS') },
            { 'id': '2', 'criteria': $translate.instant('CATEGORY') },
        ];

        initController();

        function initController() {

            vm.disabledCities = true;
            GeneralServices.GetCities().then(function(response) {
                if (response != null) {
                    vm.cities = response.parse_info;
                    vm.disabledCities = false;
                };
            }).catch(angular.noop);

            vm.disabledCategories = true;
            PlaceService.GetPlaceCategories()
                .then(function(response) {
                    if (response != null) {
                        vm.categories = response.parse_data;
                        vm.disabledCategories = false;
                    };
                }).catch(angular.noop);

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

        function SearchPlaces() {
            vm.searchLoading = true;
            vm.SearchPerformed = true;
            vm.noSearchedPlacesFound = false;
            PlaceService.SearchPlaces(vm.searchcategory.id, vm.searchcity, vm.searchobj)
                .then(function(response) {
                    if (response != null) {
                        if (response.parse_data.length > 0) {
                            vm.searchedPlaces = response.parse_data;
                            var begin = ((vm.currentSearchPage - 1) * vm.numSearchPerPage),
                                end = begin + vm.numSearchPerPage;

                            vm.filteredSearchedPlaces = vm.searchedPlaces.slice(begin, end);
                        } else {
                            vm.searchedPlaces = [];
                            vm.filteredSearchedPlaces = [];
                            vm.noSearchedPlacesFound = true;
                        };
                    };
                    vm.searchLoading = false;
                }).catch(angular.noop);
        }

        $scope.$watch('vm.currentPage + vm.numPerPage', function() {
            var begin = ((vm.currentPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;
            vm.filteredPlaces = vm.created_places.slice(begin, end);
        });

        $scope.$watch('vm.currentSearchPage + vm.numSearchPerPage', function() {
            var begin = ((vm.currentSearchPage - 1) * vm.numSearchPerPage),
                end = begin + vm.numSearchPerPage;
            vm.filteredSearchedPlaces = vm.searchedPlaces.slice(begin, end);
        });
    }

})();