(function() {
    'use strict';

    var app = angular
        .module('app', ['ngRoute', 'ngCookies', 'ui.router'])
        .config(config)
        .run(run);

    Parse.initialize("d6cfb8df821968fa818da234b7786c0e");
    Parse.serverURL = 'https://gparse.azurewebsites.net/parse';

    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })

        .when('/events', {
            controller: 'EventController',
            templateUrl: 'event/event.view.html',
            controllerAs: 'vm'
        })

        .when('/profile', {
            controller: 'ProfileController',
            templateUrl: 'profile/profile.view.html',
            controllerAs: 'vm'
        })

        .when('/places', {
            controller: 'PlacesController',
            templateUrl: 'place/places.view.html',
            controllerAs: 'vm'
        })

        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
        })

        .when('/register', {
            controller: 'RegisterController',
            templateUrl: 'register/register.view.html',
            controllerAs: 'vm'
        })

        .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];

    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();