﻿// app.js
var env = {};

// Import variables if present (from env.js)
if (window) {
    Object.assign(env, window.__env);
}

var app = angular
    .module('app', ['ngAnimate', 'ngCookies', 'ui.router', 'ngSanitize', 'ui.bootstrap', 'moment-picker', 'uiCropper', 'ui.utils.masks', 'ngImageCompress', 'pascalprecht.translate'])
    .config(config)
    .constant('__env', env)
    .run(run);

config.$inject = ['$stateProvider', '$urlRouterProvider'];

function config($stateProvider, $urlRouterProvider) {

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
        .state('app.profile.changepassword', {
            url: '/changepassword',
            templateUrl: 'views/internal/profile/profile.changepassword.html',
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

    .state('app.places.events', {
            url: '/events',
            params: {
                parse_place: null
            },
            templateUrl: 'views/internal/place/event/place.events.view.html',
            redirectTo: 'app.places.events.list',
            controller: 'PlaceEventsController',
            controllerAs: 'vm'
        })
        .state('app.places.events.list', {
            url: '/list',
            params: {
                parse_place: null
            },
            templateUrl: 'views/internal/place/event/place.events.list.view.html',
            controller: 'PlaceEventsListController',
            controllerAs: 'events'
        })
        .state('app.places.events.edit', {
            url: '/edit',
            params: {
                parse_place: null,
                parse_event: null
            },
            templateUrl: 'views/internal/place/event/place.events.edit.view.html',
            controller: 'EventsEditController',
            controllerAs: 'edit'
        })

    .state('app.places.edit', {
            url: '/edit',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/edit/places.edit.view.html',
            redirectTo: 'app.places.edit.data',
            controller: 'PlacesController',
            controllerAs: 'vm'
        })
        .state('app.places.edit.data', {
            url: '/data',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/edit/places.edit.data.view.html',
            controller: 'PlacesEditController',
            controllerAs: 'edit'
        })
        .state('app.places.edit.contact', {
            url: '/contact',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/edit/places.edit.contactdata.view.html',
            controller: 'PlacesEditController',
            controllerAs: 'edit'
        })
        .state('app.places.edit.address', {
            url: '/address',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/edit/places.edit.address.view.html',
            controller: 'PlacesEditAddressController',
            controllerAs: 'editaddr'
        })
        .state('app.places.edit.hours', {
            url: '/hours',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/edit/places.edit.hours.view.html',
            controller: 'PlacesEditHoursController',
            controllerAs: 'edithours'
        })
        .state('app.places.edit.images', {
            url: '/images',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/edit/places.edit.images.view.html',
            redirectTo: 'app.places.edit.images.gallery'
        })
        .state('app.places.edit.images.gallery', {
            url: '/gallery',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/edit/places.edit.images.gallery.view.html',
            controller: 'PlacesEditImagesController',
            controllerAs: 'editimages'
        })
        .state('app.places.edit.images.new', {
            url: '/new',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/edit/places.edit.images.new.view.html',
            controller: 'PlacesEditNewImagesController',
            controllerAs: 'editimagesnew'
        })
    .state('app.places.edit.activation', {
        url: '/activation',
        params: {
            place: null,
            parse_place: null
        },
        templateUrl: 'views/internal/place/edit/places.edit.activation.view.html',
        controller: 'PlacesEditController',
        controllerAs: 'edit'
    })
    .state('app.places.request_admin', {
            url: '/admin',
            params: {
                place: null,
                parse_place: null
            },
            templateUrl: 'views/internal/place/requestadmin/places.requestadmin.view.html',
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
            templateUrl: 'views/internal/place/requestadmin/places.requestadmin.userdata.view.html',
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
            templateUrl: 'views/internal/place/requestadmin/places.requestadmin.request.view.html',
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

    // Cities
    .state('app.locations', {
            url: 'locations',
            redirectTo: 'app.locations.cities',
            views: {
                'content@': {
                    templateUrl: 'views/internal/city/admin.locations.view.html'
                }
            }
        })
        .state('app.locations.cities', {
            url: '/cities',
            templateUrl: 'views/internal/city/city.view.html',
            controller: 'CitiesController',
            controllerAs: 'vm',
        })
        .state('app.locations.states', {
            url: '/states',
            templateUrl: 'views/internal/city/states.view.html',
            controller: 'StatesController',
            controllerAs: 'vm',
        })

    // login
    .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'views/external/login/login.view.html',
        controllerAs: 'vm',
        hideSideBar: true
    })

    // lostpassword
    .state('lostpassword', {
        url: '/lostpassword',
        controller: 'RegisterController',
        templateUrl: 'views/external/register/lostpassword.view.html',
        controllerAs: 'vm',
        hideSideBar: true
    })

    // register
    .state('register', {
        url: '/register',
        controller: 'RegisterController',
        templateUrl: 'views/external/register/register.view.html',
        controllerAs: 'vm',
        hideSideBar: true
    });

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

function appLoading( $animate ) {
    debugger
    // Return the directive configuration.
    return({
        link: link,
        restrict: "C"
    });

    function link( scope, element, attributes ) {
        debugger
        $animate.leave( element.children().eq( 1 ) ).then(
            function cleanupAfterAnimation() {
                
                debugger
                element.remove();
                // Clear the closed-over variable references.
                scope = element = attributes = null;
            }
        );
    }
}