(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesEditAddressController', PlacesEditAddressController);

    PlacesEditAddressController.$inject = ['$scope', '$state', '$rootScope', 'PlaceService', 'GeneralServices', 'FlashService', '$stateParams', '$timeout', 'NgMap'];

    function PlacesEditAddressController($scope, $state, $rootScope, PlaceService, GeneralServices, FlashService, $stateParams, $timeout, NgMap) {
        var editaddr = this;
        editaddr.mapLoading = true;
        editaddr.place = [];
        editaddr.savePlaceAddressData = savePlaceAddressData;
        editaddr.isNewRecord = true;
        var map;
        var map_place;

        initController();

        function initController() {

            // define input place
            if ($stateParams.parse_place != null || $stateParams.place != null) {
                if ($stateParams.parse_place != null) {
                    editaddr.place = PlaceService.ParseToAngularObject($stateParams.parse_place);
                    editaddr.isNewRecord = false;
                } else if ($stateParams.place != null) {
                    editaddr.place = $stateParams.place;
                    editaddr.isNewRecord = false;
                }

                if (editaddr.place.location != null) {
                    var initial_longitude = editaddr.place.longitude;
                    var initial_latitude = editaddr.place.latitude;
                    var vzoom = 17;
                } else if (editaddr.place.city.attributes.location != null) {
                    var initial_longitude = editaddr.place.city.attributes.location._longitude;
                    var initial_latitude = editaddr.place.city.attributes.location._latitude;
                    var vzoom = 10;
                } else {
                    var initial_longitude = -13.6576109;
                    var initial_latitude = -69.7138543;
                    var vzoom = 8;
                }

                //Map initialization
                $timeout(function($scope) {

                    map = new google.maps.Map(document.getElementById('map'), {
                        center: {
                            lat: initial_latitude,
                            lng: initial_longitude
                        },
                        zoom: vzoom
                    });

                    editaddr.mapLoading = false;

                    var input = /** @type {!HTMLInputElement} */ (
                        document.getElementById('pac-input'));

                    var autocomplete = new google.maps.places.Autocomplete(input);
                    autocomplete.bindTo('bounds', map);

                    var infowindow = new google.maps.InfoWindow();
                    var marker = new google.maps.Marker({
                        map: map,
                        position: {
                            lat: initial_latitude,
                            lng: initial_longitude
                        },
                    });

                    autocomplete.addListener('place_changed', function($scope) {
                        infowindow.close();
                        marker.setVisible(false);
                        var map_place = autocomplete.getPlace();
                        if (!map_place.geometry) {
                            FlashService.Error("Local informado não foi encontrado!");
                            return;
                        }

                        var paclatitude = /** @type {!HTMLInputElement} */ (
                            document.getElementById('pac-lat'));
                        var paclongitude = /** @type {!HTMLInputElement} */ (
                            document.getElementById('pac-long'));

                        paclatitude.value = map_place.geometry.location.lat();
                        paclongitude.value = map_place.geometry.location.lng();

                        FlashService.clearFlashMessage();
                        if (map_place.geometry.viewport) {
                            map.fitBounds(map_place.geometry.viewport);
                        } else {
                            map.setCenter(map_place.geometry.location);
                            map.setZoom(17);
                        }
                        marker.setIcon( /** @type {google.maps.Icon} */ ({
                            url: map_place.icon,
                            size: new google.maps.Size(71, 71),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(17, 34),
                            scaledSize: new google.maps.Size(35, 35)
                        }));
                        marker.setPosition(map_place.geometry.location);
                        marker.setVisible(true);

                        var address = '';
                        if (map_place.address_components) {
                            address = [
                                (map_place.address_components[0] && map_place.address_components[0].short_name || ''),
                                (map_place.address_components[1] && map_place.address_components[1].short_name || ''),
                                (map_place.address_components[2] && map_place.address_components[2].short_name || '')
                            ].join(' ');
                        }

                        infowindow.setContent('<div><strong>' + map_place.name + '</strong><br>' + address);
                        infowindow.open(map, marker);
                    });
                }, 2000);
            } else {
                $state.go('app.places.myplaces');
            };
        }

        function isNewRecord() {
            if (editaddr.place.id != null) {
                return false;
            } else {
                return true;
            }
        }

        function savePlaceAddressData($scope) {

            var input = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-input'));
            var lat = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-lat'));
            var long = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-long'));

            editaddr.place.address = input.value;
            editaddr.place.latitude = lat.value;
            editaddr.place.longitude = long.value;

            editaddr.dataLoading = true;
            PlaceService.SavePlace(editaddr.place).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        editaddr.dataLoading = false;
                        editaddr.place = PlaceService.ParseToAngularObject(response.place);
                        $state.go('app.places.created');
                    } else {
                        FlashService.Error(response.message);
                        edit.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };
    }

})();