(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlaceEventsListController', PlaceEventsListController);

    PlaceEventsListController.$inject = ['EventService', '$state', '$stateParams'];

    function PlaceEventsListController(EventService, $state, $stateParams) {
        var events = this;
        events.place = [];
        events.filteredEvents = [];
        events.placeEvents = [];
        events.numPerPage = 10;
        events.currentPage = 1;
        events.cancelEvent = cancelEvent;

        // define input place
        if ($stateParams.parse_place != null) {
            events.place = $stateParams.parse_place;
        } else {
            $state.go('app.places.myplaces');
        }

        initController();

        function initController() {

            events.eventsLoading = true;

            EventService.GetPlaceEvents(events.place)
                .then(function(response) {
                    if (response != null) {
                        if (response.parse_data.length > 0) {
                            events.placeEvents = response.parse_data;
                            var begin = ((events.currentPage - 1) * events.numPerPage),
                                end = begin + events.numPerPage;

                            events.filteredEvents = events.placeEvents.slice(begin, end);
                        } else {
                            events.noEventsFound = true;
                        };
                    };
                    events.eventsLoading = false;
                }).catch(angular.noop);
        }

        function cancelEvent(event) {

            events.cancelEventLoading = true;

            EventService.CancelEvent(event)
                .then(function(response) {
                    if (response != null) {
                        events.filteredEvents = events.filteredEvents.filter(function(obj) { return obj.id != event.id; });
                        events.placeEvents = events.placeEvents.filter(function(obj) { return obj.id != event.id; });
                        events.requestCancelLoading = false;
                    };
                    events.cancelEventLoading = false;
                }).catch(angular.noop);
        }


    }

})();