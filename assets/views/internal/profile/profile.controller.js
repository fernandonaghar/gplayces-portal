(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$state', 'UserService', '$scope', 'FlashService', 'GeneralServices', 'EmailService'];

    function ProfileController($state, UserService, $scope, FlashService, GeneralServices, EmailService) {
        var profile = this;
        profile.saveUserData = saveUserData;
        profile.saveAddressData = saveAddressData;
        profile.linkWithFacebook = linkWithFacebook;
        profile.testEmail = testEmail;

        initController();

        function initController() {
            profile.user = UserService.GetCurrentUser();
            profile.isFacebookLinked = UserService.isFacebookLinked();
            setFacebookStatus();

            // Get User profile Data
            UserService.GetCurrentUserInfo().then(function(response) {
                if (response != null) {
                    profile.userinfo = response.info;
                };
            }).catch(angular.noop);

            // Get Cities list
            GeneralServices.GetCities().then(function(response) {
                if (response != null) {
                    profile.cities = response.parse_info;
                };
            }).catch(angular.noop);
        }

        function saveUserData() {
            profile.dataLoading = true;
            UserService.SaveCurrentUser(profile.user).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        UserService.SaveUserInfo(profile.userinfo).then(function(response) {
                            if (response != null) {
                                if (response.success) {
                                    profile.dataLoading = false;
                                    $state.go('app.profile.address');
                                } else {
                                    FlashService.Error(response.message);
                                    profile.dataLoading = false;
                                }
                            };
                        }).catch(angular.noop);
                    } else {
                        FlashService.Error(response.message);
                        profile.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };

        function saveAddressData() {
            profile.dataLoading = true;
            UserService.SaveUserInfo(profile.userinfo).then(function(response) {
                if (response != null) {
                    if (response.success) {
                        profile.dataLoading = false;
                        $state.go('app.profile.photo');
                    } else {
                        FlashService.Error(response.message);
                        profile.dataLoading = false;
                    }
                };
            }).catch(angular.noop);
        };

        function testEmail() {
            EmailService.sendEmail();
        }

        function linkWithFacebook(action) {
            profile.facebookLoading = true;
            if (action == 'Link') {
                UserService.LinkFacebook().then(function(response) {
                    if (response != null) {
                        if (response.success) {
                            profile.isFacebookLinked = UserService.isFacebookLinked();
                            setFacebookStatus();
                            profile.facebookLoading = false;
                        } else {
                            FlashService.Error("A associação com o facebook falhou.");
                            profile.facebookLoading = false;
                        }
                    };
                }).catch(angular.noop);
            } else {
                UserService.UnlinkFacebook().then(function(response) {
                    if (response != null) {
                        if (response.success) {
                            profile.isFacebookLinked = UserService.isFacebookLinked();
                            setFacebookStatus();
                            profile.facebookLoading = false;
                        } else {
                            FlashService.Error("A desassociação da conta do facebook falhou.");
                            profile.facebookLoading = false;
                        }
                    };
                }).catch(angular.noop);
            }
        }

        function setFacebookStatus() {
            if (profile.isFacebookLinked) {
                profile.facebookStatus = 'Associada';
            } else {
                profile.facebookStatus = 'Não associada';
            }
        }

    }

})();