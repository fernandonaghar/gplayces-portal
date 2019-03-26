(function() {
    'use strict';

    angular
        .module('app')
        .directive('getHeight', function() {
            var addPadding = 10;
            return {
                link: function(scope, element, attrs) {
                    scope.$watch( 'watchedHeight', function(newHeight) {
                        element.css({
                          'padding-top': newHeight+addPadding+'px'
                        });
                    });
                }
            }
        })
        .directive('watchHeight', function($rootScope) {
            return {
                link: function(scope, element, attrs) {
                    scope.$watch(function() {
                      scope.watchedHeight = element[0].offsetHeight;
                    });
                    
                    angular.element(window).on('resize', function() {
                      $rootScope.$apply(function() {
                        scope.watchedHeight = element[0].offsetHeight;
                      })
                    });
                }
            }
        })
})