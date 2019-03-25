(function() {
    'use strict';

    angular
        .module('app')
        .controller('EventsEditController', EventsEditController);

    EventsEditController.$inject = ['$scope', '$state', 'EventService', 'FlashService', '$stateParams', '$timeout', '$q', 'AzureStorageService'];

    function EventsEditController($scope, $state, EventService, FlashService, $stateParams, $timeout, $q, AzureStorageService) {
        var edit = this;
        edit.isNewRecord = true;
        edit.saveEvent = saveEvent;

        edit.blobURI = AzureStorageService.getBlobURI();
        edit.event = [];
        $scope.image1 = [];

        edit.myCroppedImage = '';
        edit.resultBlob = '';

        initController();

        function initController() {

            // define input place
            if ($stateParams.parse_place != null) {
                edit.place = $stateParams.parse_place;
            }
            if ($stateParams.parse_event != null) {
                edit.event = EventService.ParseToAngularObject($stateParams.parse_event);
                edit.isNewRecord = false;

                edit.datesLoading = true;

                if (edit.event.coverImage != null) {
                    var compressed = [];
                    compressed.dataURL = edit.blobURI + '/event/' + edit.event.coverImage;
                    $scope.image1.compressed = compressed;

                    edit.previousFile = $scope.image1.compressed.dataURL;

                } else {
                    $scope.image1 = '';
                }
            }
        }

        function saveEvent() {
            edit.dataLoading = true;

            EventService.SaveEvent(edit.place, edit.event).then(function(response) {
                if (response != null) {
                    if (response.success) {

                        edit.event.id = response.object.id;
                        var promises = [];

                        if (edit.fileChanged == true) {

                            if (edit.previousFile != null) {
                                AzureStorageService.DeleteBlob('event', edit.event.coverImage);
                            }

                            var timestamp = new Date().toISOString();
                            edit.resultBlob.name = response.object.id + '_' + timestamp + '.jpg';
                            edit.event.coverImage = edit.resultBlob.name;

                            var speedsummary = AzureStorageService.UploadBlob('event', edit.resultBlob.name, edit.resultBlob, function(error, result, response) {
                                if (error) {
                                    FlashService.Error(error.message);
                                    edit.dataLoading = false;
                                } else {
                                    var promise = EventService.SaveEvent(edit.place, edit.event);
                                    promises.push(promise);
                                }
                            });
                        }

                        if (promises.length > 0) {
                            $q.all(promises).then(
                                function(object) {
                                    edit.dataLoading = false;
                                    $state.go('app.places.events.list', { parse_place: edit.place });
                                }
                            );
                        } else {
                            edit.dataLoading = false;
                            $state.go('app.places.events.list', { parse_place: edit.place });
                        };

                    } else {
                        FlashService.Error(response.message);
                        edit.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };

        var handleFileSelect = function(evt) {
            edit.fileChanged = true;
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    }

})();