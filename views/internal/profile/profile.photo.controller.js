(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfilePhotoController', ProfilePhotoController);

    ProfilePhotoController.$inject = ['$scope', '$state', 'UserService', 'FlashService', 'AzureStorageService', '$timeout'];

    function ProfilePhotoController($scope, $state, UserService, FlashService, AzureStorageService, $timeout) {
        var photo = this;
        photo.user = UserService.GetCurrentUser();
        photo.updateProfilePhoto = updateProfilePhoto;
        photo.uploadFinished = true;
        var speedSummary;

        photo.currentPicture = UserService.GetProfilePhotoURL();
        if (photo.currentPicture != null) {
            var compressed = [];
            $scope.image1 = [];
            compressed.dataURL = UserService.GetProfilePhotoURL();
            $scope.image1.compressed = compressed;
        }

        photo.myCroppedImage = '';
        photo.resultBlob = '';

        function updateProfilePhoto() {

            if (photo.user.picture != null) {
                AzureStorageService.DeleteBlob('profilephoto', photo.user.picture);
            }

            displayProcess(0);
            photo.uploadFinished = false;
            var timestamp = new Date().toISOString();
            photo.resultBlob.name = photo.user.id + '_' + timestamp + '.jpg';

            refreshProgress();
            speedSummary = AzureStorageService.UploadBlob('profilephoto', photo.resultBlob.name, photo.resultBlob, function(error, result, response) {
                photo.uploadFinished = true;
                if (error) {
                    FlashService.Error(error.message);
                    console.log(error);
                    displayProcess(0);
                } else {
                    UserService.UpdateProfilePicture(photo.resultBlob.name).then(function(response) {
                        if (response != null) {
                            if (response.success) {
                                displayProcess(100);
                            } else {
                                FlashService.Error(response.message);
                                displayProcess(0);
                                photo.uploadFinished = true;
                            }
                        };
                    }).catch(angular.noop);
                }
            });
        }

        function displayProcess(process) {
            document.getElementById("progress").style.width = process + '%';
            document.getElementById("progress").innerHTML = process + '%';
        }

        function refreshProgress() {
            setTimeout(function() {
                if (!photo.uploadFinished) {
                    var process = speedSummary.getCompletePercent();
                    displayProcess(process);
                    refreshProgress();
                }
            }, 200);
        }
    }

})();