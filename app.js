(function() {
    'use strict';

    var app = angular
        .module('app', ['ngAnimate', 'ngCookies', 'ui.router', 'ngSanitize', 'ui.bootstrap', 'uiCropper', 'pascalprecht.translate', 'ui.utils.masks'])
        .config(config)
        .run(run);

    //PRD Parse
    //Parse.initialize("d6cfb8df821968fa818da234b7786c0e");    
    //Parse.serverURL = 'https://gparse.azurewebsites.net/parse';
    //DEV Parse
    Parse.initialize("92f067f59fe76249b67d268b581fee64");
    Parse.serverURL = 'https://gparsedev.azurewebsites.net/parse';

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$translateProvider'];

    function config($stateProvider, $urlRouterProvider, $translateProvider) {

        //-------- Routing section ---------
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
            .state('app.profile.photo', {
                url: '/photo',
                templateUrl: 'views/internal/profile/profile.photo.view.html',
                controller: 'ProfilePhotoController',
                controllerAs: 'photo'
            })

        // Places
        .state('app.places', {
            url: 'places',
            views: {
                'content@': {
                    templateUrl: 'views/internal/place/places.view.html',
                },
                redirectTo: 'app.places.myplaces'
            },

        })

        .state('app.places.myplaces', {
            url: '/myplaces',
            templateUrl: 'views/internal/place/places.myplaces.view.html',
            controller: 'OwnedPlacesController',
            controllerAs: 'vm'
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
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.edit.contactdata.view.html',
                controller: 'PlacesEditController',
                controllerAs: 'edit'
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
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.edit.hours.view.html',
                controller: 'PlacesEditHoursController',
                controllerAs: 'edithours'
            })
            .state('app.places.edit.images', {
                url: '/images',
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.edit.images.view.html',
                controller: 'PlacesEditImagesController',
                controllerAs: 'editimages'
            })
            .state('app.places.edit.images.new', {
                url: '/new',
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.edit.images.view.html',
                controller: 'PlacesEditImagesController',
                controllerAs: 'editimages'
            })

        .state('app.places.request_admin', {
                url: '/admin',
                params: {
                    place: null,
                    parse_place: null
                },
                templateUrl: 'views/internal/place/places.requestadmin.view.html',
                controller: 'PlacesRequestAdminRedirectController',
                controllerAs: 'request'
            })
            .state('app.places.request_admin.userdata', {
                url: '/user',
                params: {
                    place: null,
                    parse_place: null,
                    user: null,
                    user_info: null
                },
                templateUrl: 'views/internal/place/places.requestadmin.userdata.view.html',
                controller: 'PlacesRequestAdminUserDataController',
                controllerAs: 'userdata'
            })
            .state('app.places.request_admin.request', {
                url: '/request',
                params: {
                    place: null,
                    parse_place: null
                },
                controller: 'PlacesRequestAdminRequestController',
                controllerAs: 'request',
                templateUrl: 'views/internal/place/places.requestadmin.request.view.html',
            })

        // Approval requests
        .state('app.approvalrequests', {
            url: 'approvalrequests',
            views: {
                'content@': {
                    controller: 'ApprovalRequestsController',
                    templateUrl: 'views/internal/approvalrequests/approvalrequestslist.view.html',
                    controllerAs: 'vm'
                }
            }
        })

        // login
        .state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'views/external/login/login.view.html',
            controllerAs: 'vm'
        })

        // register
        .state('register', {
            url: '/register',
            controller: 'RegisterController',
            templateUrl: 'views/external/register/register.view.html',
            controllerAs: 'vm'
        });

        //-------- Translations section ---------

        var en_translations = {
            'MONDAY': 'Monday',
            'TUESDAY': 'Tuesday',
            'WEDNESDAY': 'Wednesday',
            'THURSDAY': 'Thursday',
            'FRIDAY': 'Friday',
            'SATURDAY': 'Saturday',
            'SUNDAY': 'Sunday',
            'HOLYDAY': 'Holyday'
        }

        var pt_translations = {
            'MONDAY': 'Segunda',
            'TUESDAY': 'Terça',
            'WEDNESDAY': 'Quarta',
            'THURSDAY': 'Quinta',
            'FRIDAY': 'Sexta',
            'SATURDAY': 'Sábado',
            'SUNDAY': 'Domingo',
            'HOLYDAY': 'Feriado'
        }

        $translateProvider.translations('en', en_translations);
        $translateProvider.translations('pt', pt_translations);

        $translateProvider.preferredLanguage('pt');
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