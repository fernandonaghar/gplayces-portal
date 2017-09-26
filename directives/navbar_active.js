(function() {
    'use strict';

    angular
        .module('app')
        .directive('navTabs', NavTabs);

    NavTabs.$inject = ['$location'];

    function NavTabs($location) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                var $ul = $(element);
                //$ul.addClass("nav nav-tabs");

                var $tabs = $ul.children();
                $tabs.removeClass("active");

                var loc = location.hash.substring(1);

                $tabs.each(function() {
                    var $li = $(this);
                    var addr = $li.find('a').attr('ng-href').substring(1);
                    if (addr == loc) {
                        $li.addClass("active");
                    }
                });
            }

        };

    };

})();