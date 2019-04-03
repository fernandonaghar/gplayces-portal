(function() {
    'use strict';

    angular
        .module('app')
        .controller('EventsEditController', EventsEditController);

    EventsEditController.$inject = ['$scope', '$state', 'EventService', 'PlaceService', 'GeneralServices', 'FlashService', '$stateParams', '$timeout', '$q', 'AzureStorageService'];

    function EventsEditController($scope, $state, EventService, PlaceService, GeneralServices, FlashService, $stateParams, $timeout, $q, AzureStorageService) {
        var edit = this;
        edit.isNewRecord = true;
        edit.saveEvent = saveEvent;

        edit.blobURI = AzureStorageService.getBlobURI();
        edit.event = [];
        edit.event.useSameAddress = true;
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

                if (edit.event.coverImage != null) {
                    edit.previousFile = edit.blobURI + '/event/' + edit.event.coverImage;
                } else {
                    $scope.image1 = '';
                }
            }           

            edit.disabledCities = true;
            GeneralServices.GetCities().then(function(response) {
                if (response != null) {
                    edit.cities = response.parse_info;
                    edit.disabledCities = false;
                };
            }).catch(angular.noop);
            
            // init map api
            var initial_longitude = -13.6576109;
            var initial_latitude = -69.7138543;
            var vzoom = 8;

            if (edit.event.longitude && edit.event.latitude) {
                initial_longitude = edit.event.longitude;
                initial_latitude = edit.event.latitude;
                vzoom = 17;
            }
            else if (edit.place) {
                if (edit.place.attributes.location) {
                    initial_longitude = edit.place.attributes.location.longitude;
                    initial_latitude = edit.place.attributes.location.latitude;
                    vzoom = 17;
                    if (edit.place.attributes.city) {
                        edit.event.city = edit.place.attributes.city;
                    }
                    if (edit.place.attributes.address) {
                        edit.event.address = edit.place.attributes.address;
                    }       
                }
            }
            
            $timeout(function($scope) {

                if (document.getElementById('map')) {
                    var map = new google.maps.Map(document.getElementById('map'), {
                        center: {
                            lat: initial_latitude,
                            lng: initial_longitude
                        },
                        zoom: vzoom
                    });

                    edit.mapLoading = false;

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

                        if (map_place) {
                            var pac_formatted_address = /** @type {!HTMLInputElement} */ (
                                document.getElementById('pac-formatted-address'));
                            pac_formatted_address.value = map_place.formatted_address;                            
                        }                        

                        infowindow.setContent('<div><strong>' + map_place.name + '</strong><br>' + address);
                        infowindow.open(map, marker);
                    });
                }
            }, 1000);            
        }

        function saveEvent() {
            edit.dataLoading = true;

            var input = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-formatted-address'));
            var lat = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-lat'));
            var long = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-long'));

            edit.event.address = input.value;
            edit.event.latitude = Math.round(lat.value * 10000000) / 10000000;
            edit.event.longitude = Math.round(long.value * 10000000) / 10000000;

            if (edit.event.useSameAddress) {
                edit.event = setSameLocation(edit.place, edit.event);
            }
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

        function setSameLocation(parse_place, event) {

            var place = PlaceService.ParseToAngularObject(parse_place);
            event.address = place.address;
            event.city = place.city;
            event.latitude = place.latitude;
            event.longitude = place.longitude;
            return event;
        }

        var handleFileSelect = function(evt) {
            edit.fileChanged = true;
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    }

})();