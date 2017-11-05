(function() {
    'use strict';

    angular
        .module('app')
        .controller('ApprovalRequestsController', ApprovalRequestsController);

    ApprovalRequestsController.$inject = ['$scope', '$state', 'PlaceService', 'FlashService', 'AzureStorageService', 'UserService'];

    function ApprovalRequestsController($scope, $state, PlaceService, FlashService, AzureStorageService, UserService) {
        var vm = this;
        vm.dataLoading = false;
        vm.requestsLoading = true;
        vm.numPerPage = 12;
        vm.adminRequests = [];
        vm.filteredAdminRequests = [];
        vm.currentRequestPage = 1;
        vm.approvalComment = '';
        vm.denyRequest = denyRequest;
        vm.approveRequest = approveRequest;

        // Attachment
        vm.URI = AzureStorageService.getBlobURI();
        vm.key = AzureStorageService.getKey();
        vm.container = '/adminaddressevidence/';

        vm.currentUser = UserService.GetCurrentUser();

        initController();

        function initController() {
            GetPendingApprovalRequests();
        }

        function GetPendingApprovalRequests() {
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

        $scope.$watch('vm.currentRequestPage + vm.numPerPage', function() {
            var begin = ((vm.currentRequestPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;

            vm.filteredAdminRequests = vm.adminRequests.slice(begin, end);
        });

        function denyRequest(request, approvalComment) {
            vm.dataLoading = true;
            PlaceService.DenyAdministrationRequest(request, approvalComment)
                .then(function(response) {
                    vm.filteredAdminRequests = vm.filteredAdminRequests.filter(function(obj) { return obj.id != request.id; });
                    vm.adminRequests = vm.adminRequests.filter(function(obj) { return obj.id != request.id; });

                    vm.dataLoading = false;
                    vm.approvalComment = '';
                }).catch(angular.noop);
        }

        function approveRequest(request, approvalComment) {
            vm.dataLoading = true;
            PlaceService.ApproveAdministrationRequest(request, approvalComment)
                .then(function(response) {
                    vm.filteredAdminRequests = vm.filteredAdminRequests.filter(function(obj) { return obj.id != request.id; });
                    vm.adminRequests = vm.adminRequests.filter(function(obj) { return obj.id != request.id; });

                    vm.dataLoading = false;
                    vm.approvalComment = '';
                }).catch(angular.noop);
        }

    }

})();