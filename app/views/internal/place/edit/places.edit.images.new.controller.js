(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesEditNewImagesController', PlacesEditNewImagesController);

    PlacesEditNewImagesController.$inject = ['$scope', '$state', 'PlaceService', 'FlashService', 'AzureStorageService', '$timeout', '$stateParams'];

    function PlacesEditNewImagesController($scope, $state, PlaceService, FlashService, AzureStorageService, $timeout, $stateParams) {
        var editimagesnew = this;
        editimagesnew.AddPhotoToGallery = AddPhotoToGallery;
        editimagesnew.uploadFinished = true;

        editimagesnew.photoTypeOptions = [
            { 'id': '0', 'value': 'Thumbnail' },
            { 'id': '1', 'value': 'Foto da galeria' },
        ];

        editimagesnew.resultImageSize = 500;
        editimagesnew.displayPhotoSelected = false;

        var speedSummary;

        editimagesnew.myCroppedImage = '';
        editimagesnew.resultBlob = '';

        // define input place
        if ($stateParams.parse_place != null) {
            editimagesnew.place = PlaceService.ParseToAngularObject($stateParams.parse_place);
        } else if ($stateParams.place != null) {             
            if ($stateParams.place.attributes) {
                editimagesnew.place = PlaceService.ParseToAngularObject($stateParams.place);
            }
            else {
                editimagesnew.place = $stateParams.place;
            }            
        } else {
            $state.go('app.places.myplaces');
        }

        $scope.$watch('editimagesnew.photoType', function() {
            editimagesnew.displayPhotoSelected = false;
            $scope.image1 = '';

            if (editimagesnew.photoType != null) {

                if (editimagesnew.photoType.id == 0) {
                    editimagesnew.resultImageSize = 150;
                } else {
                    editimagesnew.resultImageSize = 500;
                }
            }

        });

        var handleFileSelect = function(evt) {
            editimagesnew.displayPhotoSelected = true;
        };
        var fileInput = document.querySelector('#fileInput');
        angular.element(fileInput).on('change', handleFileSelect);

        function AddPhotoToGallery() {

            displayProcess(0);
            editimagesnew.uploadFinished = false;
            var timestamp = new Date().toISOString();
            editimagesnew.resultBlob.name = editimagesnew.place.id + '_' + timestamp + '.jpg';

            refreshProgress();
            speedSummary = AzureStorageService.UploadBlob('place', editimagesnew.resultBlob.name, editimagesnew.resultBlob, function(error, result, response) {
                editimagesnew.uploadFinished = true;
                if (error) {
                    FlashService.Error(error.message);
                    console.log(error);
                    displayProcess(0);
                } else {
                    if (editimagesnew.photoType.id == '0') {

                        if (editimagesnew.place.coverImage != null) {
                            AzureStorageService.DeleteBlob('place', editimagesnew.place.coverImage);
                        }
                        editimagesnew.place.coverImage = editimagesnew.resultBlob.name;

                        PlaceService.SavePlace(editimagesnew.place).then(function(response) {
                            if (response != null) {
                                if (response.success) {
                                    displayProcess(100);
                                } else {
                                    FlashService.Error(response.message);
                                    displayProcess(0);
                                    editimagesnew.uploadFinished = true;
                                }
                            };
                        }).catch(angular.noop);
                    } else {
                        if (editimagesnew.sequence == null || editimagesnew.sequence == '') {
                            editimagesnew.sequence = 10;
                        }
                        PlaceService.AddPlacePicture(editimagesnew.place.parse_object, editimagesnew.resultBlob.name, editimagesnew.sequence).then(function(response) {
                            if (response != null) {
                                if (response.success) {
                                    displayProcess(100);
                                } else {
                                    FlashService.Error(response.message);
                                    displayProcess(0);
                                    editimagesnew.uploadFinished = true;
                                }
                            };
                        }).catch(angular.noop);
                    }
                }
            });
        }

        function displayProcess(process) {
            document.getElementById("progress").style.width = process + '%';
            document.getElementById("progress").innerHTML = process + '%';
        }

        function refreshProgress() {
            setTimeout(function() {
                if (!editimagesnew.uploadFinished) {
                    var process = speedSummary.getCompletePercent();
                    displayProcess(process);
                    refreshProgress();
                }
            }, 200);
        }


    }

})();