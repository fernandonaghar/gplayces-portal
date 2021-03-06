(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesEditHoursController', PlacesEditHoursController);

    PlacesEditHoursController.$inject = ['$state', '$rootScope', 'PlaceService', 'GeneralServices', 'FlashService', '$stateParams', '$timeout'];

    function PlacesEditHoursController($state, $rootScope, PlaceService, GeneralServices, FlashService, $stateParams, $timeout) {
        var edithours = this;
        edithours.saveHoursData = saveHoursData;
        edithours.removeHoursData = removeHoursData;
        edithours.advanceFlow = advanceFlow;
        edithours.isNewRecord = true;
        edithours.addedHours = [];

        edithours.availableHours = ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30',
            '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00',
            '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
            '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
            '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
        ];

        edithours.weekdays = [
            { 'id': 2, 'day': 'Monday', 'translation': '2_WEEKDAY' },
            { 'id': 3, 'day': 'Tuesday', 'translation': '3_WEEKDAY'  },
            { 'id': 4, 'day': 'Wednesday', 'translation': '4_WEEKDAY'  },
            { 'id': 5, 'day': 'Thursday', 'translation': '5_WEEKDAY'  },
            { 'id': 6, 'day': 'Friday', 'translation': '6_WEEKDAY'  },
            { 'id': 7, 'day': 'Saturday', 'translation': '7_WEEKDAY'  },
            { 'id': 1, 'day': 'Sunday', 'translation': '1_WEEKDAY'  },
            { 'id': 0, 'day': 'Holidays', 'translation': '0_WEEKDAY'  }
        ];

        initController();

        function initController() {

            // define input place
            if ($stateParams.parse_place != null) {
                edithours.place = PlaceService.ParseToAngularObject($stateParams.parse_place);
                edithours.isNewRecord = false;
            } else if ($stateParams.place != null) {
                if ($stateParams.place.attributes) {
                    edithours.place = PlaceService.ParseToAngularObject($stateParams.place);
                } 
                else {
                    edithours.place = $stateParams.place;
                }
                edithours.isNewRecord = false;
            } else {
                $state.go('app.places.myplaces');
            }

            if (edithours.place != null) {
                edithours.hoursLoading = true;
                PlaceService.GetPlaceHours(edithours.place.parse_object)
                    .then(function(response) {
                        if (response != null) {
                            edithours.addedHours = response.parse_data;
                            edithours.hoursLoading = false;
                        };
                    }).catch(angular.noop);
            }
        }

        function saveHoursData() {

            edithours.saveHoursLoading = true;
            var hours = {
                "dayId": edithours.selectedDay.id,
                "day": edithours.selectedDay.day,
                "startDay": edithours.selectedStartDay,
                "endDay": edithours.selectedEndDay,
                "startNight": edithours.selectedStartNight,
                "endNight": edithours.selectedEndNight
            };

            PlaceService.AddPlaceHours(edithours.place.parse_object, hours).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        edithours.addedHours.push(response.parse_object);
                        edithours.saveHoursLoading = false;
                    } else {
                        FlashService.Error(response.message);
                        edithours.saveHoursLoading = false;
                    }
                };
            }).catch(angular.noop);
        };

        function removeHoursData(hours) {
            edithours.removeHoursLoading = true;
            PlaceService.RemovePlaceHours(hours);
            edithours.addedHours = edithours.addedHours.filter(function(obj) { return obj != hours; });
            edithours.removeHoursLoading = false;

        };

        function advanceFlow() {
            $state.go('app.places.edit.images', { place: edithours.place });
        };
    }

})();