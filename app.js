(function() {
    'use strict';

    var app = angular
        .module('app', ['ngRoute', 'ngAnimate', 'ngCookies', 'ui.router'])
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
                views: {
                    'header': {
                        templateUrl: 'views/internal/header.html'
                    },
                    'sidebar': {
                        controller: 'SidebarController',
                        templateUrl: 'views/internal/sidebar/sidebar.html',
                        controllerAs: 'vm'
                    },
                    'content': {
                        templateUrl: 'views/internal/content.html'
                    },
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

        // User profile Data
        .state('app.profile', {
                url: 'profile',
                views: {
                    'content@': {
                        controller: 'ProfileController',
                        templateUrl: 'views/internal/profile/profile.view.html',
                        controllerAs: 'profile'
                    }
                }
            })
            .state('app.profile.personal', {
                url: '/personal',
                templateUrl: 'views/internal/profile/profile.personal.view.html',
            })
            .state('app.profile.address', {
                url: '/address',
                templateUrl: 'views/internal/profile/profile.address.view.html',
            })

        .state('app.places', {
            url: 'places',
            views: {
                'content@': {
                    controller: 'PlacesController',
                    templateUrl: 'views/internal/place/places.view.html',
                    controllerAs: 'vm'
                }
            }
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