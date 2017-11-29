(function() {
    'use strict';

    angular
        .module('app')
        .controller('PlacesEditImagesController', PlacesEditImagesController);

    PlacesEditImagesController.$inject = ['$state', '$rootScope', 'PlaceService', 'FlashService', '$stateParams', 'AzureStorageService', '$translate'];

    function PlacesEditImagesController($state, $rootScope, PlaceService, FlashService, $stateParams, AzureStorageService, $translate) {
        var editimages = this;
        editimages.advanceFlow = advanceFlow;
        editimages.RemovePhoto = RemovePhoto;
        editimages.backwardPosition = backwardPosition;
        editimages.nextPosition = nextPosition;
        editimages.photoGallery = [];
        editimages.filteredGallery = [];
        editimages.currentPage = 1;
        editimages.numPerPage = 10;
        editimages.blobURI = AzureStorageService.getBlobURI();

        initController();

        function initController() {

            // define input place
            if ($stateParams.parse_place != null) {
                editimages.place = PlaceService.ParseToAngularObject($stateParams.parse_place);
            } else if ($stateParams.place != null) {
                editimages.place = $stateParams.place;
            } else {
                $state.go('app.places.myplaces');
            }

            if (editimages.place != null) {
                editimages.GalleryLoading = true;
                PlaceService.GetPlacePictures(editimages.place.parse_object)
                    .then(function(response) {
                        if (response != null) {
                            if (response.parse_data.length > 0) {

                                for (var i = 0; i < response.parse_data.length; i++) {
                                    var photo = PlaceService.PlacePictureParseToAngularObject(response.parse_data[i]);
                                    editimages.photoGallery.push(photo);
                                }

                                editimages.photoGallery.sort(function(a, b) { return a.position - b.position });
                                var begin = ((editimages.currentPage - 1) * editimages.numPerPage),
                                    end = begin + editimages.numPerPage;

                                editimages.filteredGallery = editimages.photoGallery.slice(begin, end);
                                editimages.GalleryLoading = false;
                            } else {
                                editimages.noImagesFound = true;
                                editimages.GalleryLoading = false;
                            };

                        };
                    }).catch(angular.noop);
            }

        }

        function nextPosition(image) {

            var totalLength = editimages.photoGallery.length;
            var currentIndex = editimages.photoGallery.findIndex(function(obj) { return obj == image; });

            if (totalLength > currentIndex + 1) {

                editimages.positionChangeLoading = true;
                var nextPosition = editimages.photoGallery[currentIndex + 1].position;
                editimages.photoGallery[currentIndex].position = nextPosition + 1;

                PlaceService.UpdatePlacePicturePosition(image.parse_object, editimages.photoGallery[currentIndex].position)
                    .then(function(response) {
                        if (response.success) {

                            editimages.photoGallery.sort(function(a, b) { return a.position - b.position });
                            var begin = ((editimages.currentPage - 1) * editimages.numPerPage),
                                end = begin + editimages.numPerPage;

                            editimages.filteredGallery = editimages.photoGallery.slice(begin, end);
                            editimages.positionChangeLoading = false;
                        } else {
                            FlashService.Error(response.message);
                            editimages.positionChangeLoading = false;
                        };
                    }).catch(angular.noop);
            }
        };

        function backwardPosition(image) {

            var totalLength = editimages.photoGallery.length;
            var currentIndex = editimages.photoGallery.findIndex(function(obj) { return obj == image; });

            if (currentIndex > 0) {

                editimages.positionChangeLoading = true;
                var prevPosition = editimages.photoGallery[currentIndex - 1].position;
                editimages.photoGallery[currentIndex].position = prevPosition - 1;

                PlaceService.UpdatePlacePicturePosition(image.parse_object, editimages.photoGallery[currentIndex].position)
                    .then(function(response) {
                        if (response.success) {

                            editimages.photoGallery.sort(function(a, b) { return a.position - b.position });

                            var begin = ((editimages.currentPage - 1) * editimages.numPerPage),
                                end = begin + editimages.numPerPage;

                            editimages.filteredGallery = editimages.photoGallery.slice(begin, end);
                            editimages.positionChangeLoading = false;
                        } else {
                            FlashService.Error(response.message);
                            editimages.positionChangeLoading = false;
                        };
                    }).catch(angular.noop);
            }
        };

        function RemovePhoto(image) {

            editimages.removeImageLoading = true;

            AzureStorageService.DeleteBlob('place', image.fileURL);
            PlaceService.RemovePlacePicture(image.parse_object);

            editimages.photoGallery = editimages.photoGallery.filter(function(obj) { return obj != image; });
            editimages.filteredGallery = editimages.filteredGallery.filter(function(obj) { return obj != image; });
            editimages.removeImageLoading = false;

        };

        function advanceFlow() {

            if (editimages.place.coverImage == null) {
                FlashService.Error($translate.instant('COVER_IMAGE_REQUIRED'));
            } else {
                editimages.place.isActive = true;

                editimages.GalleryLoading = true;
                PlaceService.SavePlace(editimages.place).then(function(response) {
                    if (response != null) {
                        if (response.success) {
                            editimages.GalleryLoading = false;

                            $state.go('app.places.myplaces');
                        } else {
                            FlashService.Error(response.message);
                            editimages.GalleryLoading = false;
                        }
                    };
                }).catch(angular.noop);
            }
        };
    }

})();