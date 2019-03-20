(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$state', 'UserService', '$scope', 'FlashService', 'GeneralServices', 'EmailService', '$translate'];

    function ProfileController($state, UserService, $scope, FlashService, GeneralServices, EmailService, $translate) {
        var profile = this;
        profile.saveUserData = saveUserData;
        profile.saveAddressData = saveAddressData;
        profile.linkWithFacebook = linkWithFacebook;
        profile.testEmail = testEmail;
        profile.updatePassword = updatePassword;
        profile.testCloudCode = EmailService.testCloudCode;

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

        function linkWithFacebook() {
            profile.facebookLoading = true;
            UserService.LinkFacebook().then(function(response) {
                if (response != null) {
                    if (response.success) {
                        profile.isFacebookLinked = UserService.isFacebookLinked();
                        setFacebookStatus();
                        profile.facebookLoading = false;
                        FlashService.Success($translate.instant('FACEBOOK_ACCOUNT_LINKED'));
                    } else {
                        FlashService.Error($translate.instant('FACEBOOK_ASSOCIATION_FAILED'));
                        profile.facebookLoading = false;
                    }
                };
            }).catch(angular.noop);
        }

        function setFacebookStatus() {
            if (profile.isFacebookLinked) {
                profile.facebookStatus = $translate.instant('LINKED');

            } else {
                profile.facebookStatus = $translate.instant('UNLINKED');
            }
        }

        function updatePassword() {
            profile.dataLoading = true;
            if (profile.newpassword == profile.newpasswordcheck) {

                UserService.ChangePassword(profile.newpassword).then(function(response) {
                    if (response != null) {
                        if (response.success) {
                            FlashService.Success($translate.instant('PASSWORD_UPDATED'));
                        } else {
                            FlashService.Error(response.message);
                        }
                        profile.dataLoading = false;
                    };
                }).catch(angular.noop);

            } else {
                FlashService.Error($translate.instant('PASSWORDS_DONT_MATCH'));
            }
        }
    }

})();