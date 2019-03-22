(function() {
    'use strict';

    app.directive('mAppLoading', mAppLoading);

        function mAppLoading() {

            $(".animated-container").fadeOut();                
            $(".m-app-loading").fadeOut();
        }
})();