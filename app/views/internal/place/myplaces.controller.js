(function() {
    'use strict';

    angular
        .module('app')
        .controller('OwnedPlacesController', OwnedPlacesController);

    OwnedPlacesController.$inject = ['$scope', '$state', 'PlaceService', 'FlashService', '$translate'];

    function OwnedPlacesController($scope, $state, PlaceService, FlashService, $translate) {
        var vm = this;
        vm.dataLoading = true;
        vm.requestsLoading = true;
        vm.cancelRequest = cancelRequest;
        vm.numPerPage = 10;

        vm.owned_places = [];
        vm.filteredPlaces = [];
        vm.currentPage = 1;

        vm.adminRequests = [];
        vm.filteredAdminRequests = [];
        vm.currentRequestPage = 1;

        vm.currentLanguage = $translate.use();

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

            loadRequests();
        }

        function loadRequests() {
            PlaceService.GetMyApprovalRequests()
                .then(function(response) {
                    if (response != null) {
                        if (response.parse_data.length > 0) {
                            vm.adminRequests = response.parse_data;
                            var begin = ((vm.currentRequestPage - 1) * vm.numPerPage),
                                end = begin + vm.numPerPage;

                            vm.filteredAdminRequests = vm.adminRequests.slice(begin, end);
                        } else {
                            vm.noAdminRequestsFound = true;
                        };
                    };
                    vm.requestsLoading = false;
                }).catch(angular.noop);
        }

        $scope.$watch('vm.currentPage + vm.numPerPage', function() {
            var begin = ((vm.currentPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;

            vm.filteredPlaces = vm.owned_places.slice(begin, end);
        });

        $scope.$watch('vm.currentRequestPage + vm.numPerPage', function() {
            var begin = ((vm.currentRequestPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;

            vm.filteredAdminRequests = vm.adminRequests.slice(begin, end);
        });

        function cancelRequest(request) {
            vm.requestCancelLoading = true;
            PlaceService.cancelAdministrationRequest(request)
                .then(function(response) {
                    vm.filteredAdminRequests = vm.filteredAdminRequests.filter(function(obj) { return obj.id != request.id; });
                    vm.adminRequests = vm.adminRequests.filter(function(obj) { return obj.id != request.id; });
                    vm.requestCancelLoading = false;
                }).catch(angular.noop);
        }
    }

})();