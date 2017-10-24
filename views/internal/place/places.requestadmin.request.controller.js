(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesRequestAdminRequestController', PlacesRequestAdminRequestController);

    PlacesRequestAdminRequestController.$inject = ['$scope', '$state', 'PlaceService', 'FlashService', '$stateParams', 'UserService', 'AzureStorageService'];

    function PlacesRequestAdminRequestController($scope, $state, PlaceService, FlashService, $stateParams, UserService, AzureStorageService) {
        var request = this;
        request.place = $stateParams.place;
        request.parse_place = $stateParams.parse_place;
        request.submitRequest = submitRequest;
        request.user = [];
        request.adminrequest = [];
        request.fileNotAttached = true;
        request.dataLoading = false;

        var speedSummary;

        initController();

        function initController() {

            if ($stateParams.parse_place == null || $stateParams.place == null) {
                $state.go('app.places.myplaces');
            };
        }

        var handleFileSelect = function(evt) {
            var file = evt.currentTarget.files[0];
            request.file = file;
            request.fileNotAttached = false;
        };
        var fileselector = document.querySelector('#addressAssurance');

        angular.element(fileselector).on('change', handleFileSelect);

        function submitRequest() {
            request.dataLoading = true;
            request.filename = request.file.name;

            PlaceService.CreatePlaceAdministrationRequest(request.place, request).then(function(response) {
                if (response != null) {
                    if (response.success) {

                        speedSummary = AzureStorageService.UploadBlob('adminaddressevidence', response.request.attributes.approvalRequest.id, request.file, function(error, result, response) {
                            request.uploadFinished = true;
                            if (error) {
                                FlashService.Error(error);
                                displayProcess(0);
                            } else {
                                displayProcess(100);
                                request.dataLoading = false;
                                $state.go('app.places.myplaces');
                            }
                        });

                    } else {
                        FlashService.Error(response.message);
                        request.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        }

        function displayProcess(process) {
            document.getElementById("progress").style.width = process + '%';
            document.getElementById("progress").innerHTML = process + '%';
        }

        function refreshProgress() {
            setTimeout(function() {
                if (!request.uploadFinished) {
                    var process = speedSummary.getCompletePercent();
                    displayProcess(process);
                    refreshProgress();
                }
            }, 200);
        }
    }

})();