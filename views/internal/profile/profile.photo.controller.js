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

        $scope.myImage = UserService.GetProfilePhotoURL();

        photo.myCroppedImage = '';
        photo.resultBlob = '';

        var handleFileSelect = function(evt) {
            var file = evt.currentTarget.files[0];
            photo.file = file;
            var reader = new FileReader();
            reader.onload = function(evt) {
                $scope.$apply(function(photo) {
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        function updateProfilePhoto() {

            photo.uploadFinished = false;
            var timestamp = new Date().getUTCMilliseconds();
            photo.resultBlob.name = photo.user.id + '_' + timestamp + '.png';

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
        refreshProgress();
    }

})();