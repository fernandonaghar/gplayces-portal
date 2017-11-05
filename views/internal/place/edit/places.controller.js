(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesController', PlacesController);

    PlacesController.$inject = ['$scope', '$state', '$rootScope', 'PlaceService', '$stateParams'];

    function PlacesController($scope, $state, $rootScope, PlaceService, $stateParams) {
        var vm = this;
        vm.isNewRecord = true;
        vm.placeCoverImage = '';

        initController();

        function initController() {

            // define input place
            if ($stateParams.parse_place != null) {
                vm.place = PlaceService.ParseToAngularObject($stateParams.parse_place);
                vm.isNewRecord = false;
            } else if ($stateParams.place != null) {
                vm.place = $stateParams.place;
                vm.isNewRecord = false;
            }
        }

        function isNewRecord() {
            if (vm.place.id != null) {
                return false;
            } else {
                return true;
            }
        }

        if (vm.place != null) {
            vm.placeCoverImage = PlaceService.GetcoverImageURL(vm.place);

            $scope.$watch(function() { return PlaceService.GetcoverImageURL(vm.place); },
                function(value) {
                    vm.placeCoverImage = value;
                }
            );
        }
    }

})();