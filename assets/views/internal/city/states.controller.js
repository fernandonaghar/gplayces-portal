(function() {
    'use strict';

    angular
        .module('app')
        .controller('StatesController', StatesController);

    StatesController.$inject = ['$scope', '$state', 'GeneralServices', 'FlashService'];

    function StatesController($scope, $state, GeneralServices, FlashService) {
        var vm = this;
        vm.numPerPage = 8;
        vm.currentPage = 1;
        vm.currentCountryPage = 1;

        vm.newRecordState = true;
        vm.newRecordCountry = true;
        vm.noStatesFound = true;
        vm.noCountriesFound = true;

        vm.states = [];
        vm.filteredStates = [];

        vm.angularCountries = [];
        vm.filteredAngulaCountries = [];

        vm.newstate = [];
        vm.newcountry = [];

        vm.SearchStates = SearchStates;
        vm.SaveState = SaveState;
        vm.EditState = EditState;
        vm.CancelEditState = CancelEditState;

        vm.SearchCountries = SearchCountries;
        vm.SaveCountry = SaveCountry;
        vm.EditCountry = EditCountry;
        vm.CancelEditCountry = CancelEditCountry;

        LoadCountries();

        function SearchStates() {
            vm.searchStatesLoading = true;
            GeneralServices.SearchStates(vm.searchCountry, vm.searchState)
                .then(function(response) {
                    if (response != null) {
                        vm.states = [];
                        if (response.parse_info.length > 0) {
                            for (var i = 0; i < response.parse_info.length; i++) {
                                var state = GeneralServices.StateParseToAngularObject(response.parse_info[i]);
                                vm.states.push(state);
                            }
                            vm.filteredStates = vm.states.slice(0, vm.numPerPage);
                            vm.noStatesFound = false;
                        } else {
                            vm.filteredStates = [];
                            vm.noStatesFound = true;
                        };
                    };
                    vm.searchStatesLoading = false;
                }).catch(angular.noop);
        }

        function SearchCountries() {
            vm.searchCountriesLoading = true;
            GeneralServices.SearchCountries(vm.searchStringCountry)
                .then(function(response) {
                    if (response != null) {
                        vm.angularCountries = [];
                        if (response.parse_info.length > 0) {
                            for (var i = 0; i < response.parse_info.length; i++) {
                                var country = GeneralServices.CountryParseToAngularObject(response.parse_info[i]);
                                vm.angularCountries.push(country);
                            }
                            vm.filteredAngularCountries = vm.angularCountries.slice(0, vm.numPerPage);
                            vm.noCountriesFound = false;
                        } else {
                            vm.filteredAngularCountries = [];
                            vm.noCountriesFound = true;
                        };
                    };
                    vm.searchCountriesLoading = false;
                }).catch(angular.noop);
        }

        function EditState(object) {
            vm.newstate = object;
            vm.newRecordState = false;
        }

        function CancelEditState() {
            vm.newstate = [];
            vm.newRecordState = true;
        }

        function EditCountry(object) {
            vm.newcountry = object;
            vm.newRecordCountry = false;
        }

        function CancelEditCountry() {
            vm.newcountry = [];
            vm.newRecordCountry = true;
        }

        function SaveState() {
            vm.saveStateLoading = true;
            GeneralServices.SaveState(vm.newstate)
                .then(function(response) {
                    if (response != null) {
                        if (response.success) {
                            var state = GeneralServices.StateParseToAngularObject(response.object);
                            if (vm.newRecordState == true) {
                                vm.states.push(state);
                                vm.filteredStates.push(state);
                            }
                            vm.saveStateLoading = false;
                            vm.newstate = [];
                            vm.newRecordState = true;
                            vm.noStatesFound = false;
                        } else {
                            FlashService.Error(response.message);
                            vm.saveStateLoading = false;
                        };
                    };
                    vm.searchLoading = false;
                }).catch(angular.noop);
        }

        function SaveCountry() {
            vm.saveCountryLoading = true;
            GeneralServices.SaveCountry(vm.newcountry)
                .then(function(response) {
                    if (response != null) {
                        if (response.success) {
                            var country = GeneralServices.CountryParseToAngularObject(response.object);
                            if (vm.newRecordCountry == true) {
                                vm.angularCountries.push(country);
                                vm.filteredAngularCountries.push(country);
                            }
                            vm.saveCountryLoading = false;
                            vm.newcountry = [];
                            vm.newRecordCountry = true;
                            vm.noCountryFound = false;
                            LoadCountries();
                        } else {
                            FlashService.Error(response.message);
                            vm.saveCountryLoading = false;
                        };
                    };
                    vm.searchCountriesLoading = false;
                }).catch(angular.noop);
        }

        function LoadCountries() {
            vm.disabledCountries = true;
            GeneralServices.GetCountries().then(function(response) {
                if (response != null) {
                    vm.countries = response.parse_info;
                    vm.disabledCountries = false;
                };
            }).catch(angular.noop);
        }

        $scope.$watch('vm.currentPage + vm.numPerPage', function() {
            var begin = ((vm.currentPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;

            vm.filteredStates = vm.states.slice(begin, end);
        });

        $scope.$watch('vm.currentCountryPage + vm.numPerPage', function() {
            var begin = ((vm.currentCountryPage - 1) * vm.numPerPage),
                end = begin + vm.numPerPage;

            vm.filteredAngularCountries = vm.angularCountries.slice(begin, end);
        });
    }

})();