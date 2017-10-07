(function() {
    'use strict';

    var app = angular
        .module('app', ['ngAnimate', 'ngCookies', 'ui.router', 'ui.bootstrap', 'ngMap'])
        .config(config)
        .run(run);

    //PRD Parse
    //Parse.initialize("d6cfb8df821968fa818da234b7786c0e");    
    //Parse.serverURL = 'https://gparse.azurewebsites.net/parse';
    //DEV Parse
    Parse.initialize("92f067f59fe76249b67d268b581fee64");
    Parse.serverURL = 'https://gparsedev.azurewebsites.net/parse';

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
        // main app views
            .state('app', {
                url: '/',
                redirectTo: 'app.dashboard',
                views: {
                    'header': {
                        templateUrl: 'views/internal/header.html'
                    },
                    'sidebar': {
                        controller: 'SidebarController',
                        templateUrl: 'views/internal/sidebar/sidebar.html',
                        controllerAs: 'vm'
                    },
                    'content': {},
                    'footer': {
                        templateUrl: 'views/internal/footer.html'
                    }
                }
            })
            .state('app.dashboard', {
                url: 'dashboard',
                views: {
                    'content@': {
                        controller: 'DashboardController',
                        templateUrl: 'views/internal/dashboard/dashboard.view.html',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.events', {
                url: 'events',
                views: {
                    'content@': {
                        controller: 'EventController',
                        templateUrl: 'views/internal/event/event.view.html',
                        controllerAs: 'vm'
                    }
                }
            })

        // User profile
        .state('app.profile', {
                url: 'profile',
                views: {
                    'content@': {
                        controller: 'ProfileController',
                        templateUrl: 'views/internal/profile/profile.view.html',
                        controllerAs: 'profile',
                    }
                },
                redirectTo: 'app.profile.personal'
            })
            .state('app.profile.personal', {
                url: '/personal',
                templateUrl: 'views/internal/profile/profile.personal.view.html',
            })
            .state('app.profile.address', {
                url: '/address',
                templateUrl: 'views/internal/profile/profile.address.view.html',
            })

        // Places
        .state('app.places', {
                url: 'places',
                views: {
                    'content@': {
                        controller: 'PlacesController',
                        templateUrl: 'views/internal/place/places.view.html',
                        controllerAs: 'vm'
                    }
                },
                redirectTo: 'app.places.myplaces'
            })
            .state('app.places.myplaces', {
                url: '/myplaces',
                templateUrl: 'views/internal/place/places.myplaces.view.html',
            })
            .state('app.places.created', {
                url: '/created',
                templateUrl: 'views/internal/place/places.created.view.html',
                controller: 'CreatedPlacesController',
                controllerAs: 'vm'
            })
            .state('app.places.edit', {
                url: '/edit',
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.edit.view.html',
                redirectTo: 'app.places.edit.data',
                controller: 'PlacesEditController',
                controllerAs: 'edit'
            })
            .state('app.places.edit.data', {
                url: '/data',
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.edit.data.view.html',
            })
            .state('app.places.edit.contact', {
                url: '/contact',
                templateUrl: 'views/internal/place/places.edit.contactdata.view.html',
            })
            .state('app.places.edit.address', {
                url: '/address',
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.edit.address.view.html',
                controller: 'PlacesEditAddressController',
                controllerAs: 'editaddr'
            })
            .state('app.places.edit.hours', {
                url: '/hours',
                templateUrl: 'views/internal/place/places.edit.contactdata.view.html',
            })
            .state('app.places.edit.images', {
                url: '/images',
                templateUrl: 'views/internal/place/places.edit.contactdata.view.html',
            })
            .state('app.places.edit.request_admin', {
                url: '/admin',
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.edit.request_admin.view.html',
                controller: 'PlacesRequestAdminController',
                controllerAs: 'vm'
            })

        .state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'views/external/login/login.view.html',
            controllerAs: 'vm'
        })

        .state('register', {
            url: '/register',
            controller: 'RegisterController',
            templateUrl: 'views/external/register/register.view.html',
            controllerAs: 'vm'
        })
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];

    function run($rootScope, $location, $cookies, $http) {

        $rootScope.$on('$locationChangeStart', function(event, next, current) {

            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = Parse.User.current();
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();