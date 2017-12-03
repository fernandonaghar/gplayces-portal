(function() {
    'use strict';

    angular
        .module('app')
        .controller('TranslationsController', TranslationsController);

    TranslationsController.$inject = ['$scope', '$translate', '$cookies'];

    function TranslationsController($scope, $translate, $cookies) {
        var transcontrol = this;
        transcontrol.setLanguage = setLanguage;

        var enuLanguage = { 'code': 'enu', 'language': 'English', 'url': 'assets/img/usa.svg' };
        var ptbLanguage = { 'code': 'ptb', 'language': 'Português', 'url': 'assets/img/brazil.svg' };
        var espLanguage = { 'code': 'esp', 'language': 'Español', 'url': 'assets/img/spain.svg' };

        transcontrol.languageList = [
            enuLanguage,
            ptbLanguage,
            espLanguage,
        ];

        transcontrol.defaultLangCode = $cookies.get('GplaycesAppAngJSLangCodePref');

        if (transcontrol.defaultLangCode == null) {
            transcontrol.defaultLangCode = ptbLanguage.code;
        }

        transcontrol.defaultLang = transcontrol.languageList.filter(getLanguageObject)[0];

        function getLanguageObject(obj) {
            return obj.code == transcontrol.defaultLangCode;
        }

        setLanguage(transcontrol.defaultLang);

        function setLanguage(lang) {
            transcontrol.language = lang;
            $translate.use(lang.code);
            $cookies.put('GplaycesAppAngJSLangCodePref', lang.code);
        }
    }
})();