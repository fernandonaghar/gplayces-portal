(function() {
    'use strict';

    angular
        .module('app')
        .controller('CitiesController', CitiesController);

    CitiesController.$inject = ['$scope', '$state', 'GeneralServices', 'FlashService', '$timeout'];

    function CitiesController($scope, $state, GeneralServices, FlashService, $timeout) {
        var vm = this;
        vm.numPerPage = 12;
        vm.currentPage = 1;

        vm.newRecord = true;

        vm.citiesLoading = false;
        vm.noCitiesFound = true;
        vm.cities = [];
        vm.filteredCities = [];
        vm.newcity = [];

        vm.disabledSearchCityStates = true;
        vm.disabledNewCityStates = true;

        vm.SearchCities = SearchCities;
        vm.SaveCity = SaveCity;
        vm.EditCity = EditCity;
        vm.CancelEdit = CancelEdit;

        var initial_longitude = -51.92527999999999;
        var initial_latitude = -14.235004;
        var vzoom = 3;
        var map;
        var map_place;

        vm.mapLoading = true;

        initController();

        function initController() {

            vm.disabledCountries = true;
            GeneralServices.GetCountries().then(function(response) {
                if (response != null) {
                    vm.countries = response.parse_info;
                    vm.disabledCountries = false;
                };
            }).catch(angular.noop);

            //Map initialization
            $timeout(function($scope) {

                var map = new google.maps.Map(document.getElementById('map'), {
                    center: {
                        lat: initial_latitude,
                        lng: initial_longitude
                    },
                    zoom: vzoom
                });

                vm.mapLoading = false;

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
                        FlashService.Error("Cidade informada não foi encontrada!");
                        return;
                    }

                    var paclatitude = /** @type {!HTMLInputElement} */ (
                        document.getElementById('pac-lat'));
                    var paclongitude = /** @type {!HTMLInputElement} */ (
                        document.getElementById('pac-long'));
                    var pacname = /** @type {!HTMLInputElement} */ (
                        document.getElementById('pac-name'));

                    paclatitude.value = map_place.geometry.location.lat();
                    paclongitude.value = map_place.geometry.location.lng();
                    pacname.value = map_place.name;

                    FlashService.clearFlashMessage();
                    if (map_place.geometry.viewport) {
                        map.fitBounds(map_place.geometry.viewport);
                    } else {
                        map.setCenter(map_place.geometry.location);
                        map.setZoom(14);
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
                    address = map_place.name;

                    infowindow.setContent('<div><strong>' + map_place.name + '</strong><br>' + address);
                    infowindow.open(map, marker);
                });
            }, 1000);
        }

        function SearchCities() {
            vm.searchLoading = true;
            GeneralServices.SearchCities(vm.searchCountry, vm.searchState, vm.searchCity)
                .then(function(response) {
                    if (response != null) {
                        vm.cities = [];
                        if (response.parse_info.length > 0) {

                            for (var i = 0; i < response.parse_info.length; i++) {
                                var city = GeneralServices.CityParseToAngularObject(response.parse_info[i]);
                                vm.cities.push(city);
                            }
                            vm.filteredCities = vm.cities.slice(0, vm.numPerPage);
                            vm.disabledCities = false;
                            vm.noCitiesFound = false;

                        } else {

                            vm.filteredCities = [];
                            vm.noCitiesFound = true;
                        };
                    };
                    vm.searchLoading = false;
                }).catch(angular.noop);
        }

        function EditCity(object) {
            vm.newcity = object;
            vm.newRecord = false;
        }

        function CancelEdit() {
            vm.newcity = [];
            vm.newRecord = true;
        }

        function SaveCity() {

            var input = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-name'));
            var lat = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-lat'));
            var long = /** @type {!HTMLInputElement} */ (
                document.getElementById('pac-long'));

            if (input == "" || input == null || lat.value == "" || lat.value == null || long.value == "" || long.value == null) {
                FlashService.Error("Nome da cidade e coordenadas são obrigatórias. Selecione a partir da busca no mapa.");
            } else {
                vm.newcity.name = input.value;
                vm.newcity.latitude = Math.round(lat.value * 10000000) / 10000000;
                vm.newcity.longitude = Math.round(long.value * 10000000) / 10000000;

                vm.saveLoading = true;
                GeneralServices.SaveCity(vm.newcity)
                    .then(function(response) {
                        if (response != null) {
                            if (response.success) {

                                var city = GeneralServices.CityParseToAngularObject(response.object);

                                if (vm.newRecord == true) {
                                    vm.cities.push(city);
                                    vm.filteredCities.push(city);
                                }
                                vm.saveLoading = false;
                                vm.newcity = [];
                                vm.mapSearch = '';

                            } else {
                                FlashService.Error(response.message);
                                vm.saveLoading = false;
                            };
                        };
                        vm.searchLoading = false;
                    }).catch(angular.noop);
            }
        }

        $scope.$watch('vm.searchCountry', function() {
            if (vm.searchCountry != null) {

                vm.searchCityStatesLoading = true;
                vm.disabledSearchCityStates = false;

                GeneralServices.GetStates(vm.searchCountry).then(function(response) {
                    if (response != null) {
                        vm.searchStates = response.parse_info;
                    };
                    vm.searchCityStatesLoading = false;
                    vm.searchState = '';
                }).catch(angular.noop);
            }
        });

        $scope.$watch('vm.newcity.country', function() {
            if (vm.newcity.country != null) {

                vm.newCityStatesLoading = true;
                vm.disabledNewCityStates = false;

                GeneralServices.GetStates(vm.newcity.country).then(function(response) {
                    if (response != null) {
                        vm.newCityStates = response.parse_info;
                    };
                    vm.newCityStatesLoading = false;
                    vm.stateFound == false;

                    for (var i = 0; i < vm.newCityStates.length; i++) {
                        if (vm.newcity.state == vm.newCityStates[i]) {
                            vm.stateFound == true;
                            break;
                        }
                    }

                    if (vm.stateFound == false) {
                        vm.newcity.state = '';
                    }
                }).catch(angular.noop);
            }
        });

        $scope.$watch('vm.currentPage + vm.numPerPage', function() {
            var begin = ((vm.currentPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;

            vm.filteredCities = vm.cities.slice(begin, end);
        });
    }

})();