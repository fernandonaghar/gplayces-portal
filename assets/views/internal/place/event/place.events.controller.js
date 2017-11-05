(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlaceEventsController', PlaceEventsController);

    PlaceEventsController.$inject = ['EventService', '$state', '$stateParams'];

    function PlaceEventsController(EventService, $state, $stateParams) {
        var vm = this;

        // define input place
        if ($stateParams.parse_place != null) {
            vm.place = $stateParams.parse_place;
        } else {
            $state.go('app.places.myplaces');
        }
    }

})();