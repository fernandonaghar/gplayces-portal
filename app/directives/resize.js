app.directive('resize', function ($document) {
    return function (scope, element, attr) {

        var w = angular.element($document);
        scope.$watch(function () {
            return {
                'h': w['0'].body.scrollHeight, 
            };
        }, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;

            scope.resizeWithOffset = function (offsetH) {

                scope.$eval(attr.notifier);
                return { 
                    'height': (newValue.h - offsetH) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}); 