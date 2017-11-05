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
        edit.addEventDate = addEventDate;
        edit.removeEventDate = removeEventDate;

        edit.blobURI = AzureStorageService.getBlobURI();
        edit.event = [];
        edit.eventDates = [];
        $scope.image1 = [];

        edit.myCroppedImage = '';
        edit.resultBlob = '';

        edit.availableHours = ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30',
            '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00',
            '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
            '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
            '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
        ];

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

                EventService.GetEventDates($stateParams.parse_event)
                    .then(function(response) {
                        if (response != null) {
                            if (response.parse_data.length > 0) {
                                for (var i = 0; i < response.parse_data.length; i++) {

                                    var date = {
                                        "parse_object": response.parse_data[i],
                                        "date": response.parse_data[i].attributes.day,
                                        "start": response.parse_data[i].attributes.start,
                                        "end": response.parse_data[i].attributes.end
                                    };

                                    edit.eventDates.push(date);
                                }
                            };
                        };
                        edit.datesLoading = false;
                    }).catch(angular.noop);
            }
        }

        function addEventDate() {

            var date = {
                "date": edit.selectedDate,
                "start": edit.selectedStart,
                "end": edit.selectedEnd
            };

            edit.eventDates.push(date);
        };

        function removeEventDate(date) {
            edit.eventDates = edit.eventDates.filter(function(obj) { return obj != date; });
            if (date.parse_object != null) {
                EventService.RemoveEventDate(date.parse_object);
            }
        };

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

                        for (var i = 0; i < edit.eventDates.length; i++) {

                            var date = edit.eventDates[i];
                            if (date.parse_object == null) {
                                var promise = EventService.AddEventDate(response.object, date);
                                promises.push(promise);
                            }
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