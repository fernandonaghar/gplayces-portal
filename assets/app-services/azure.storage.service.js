(function() {
    'use strict';

    angular
        .module('app')
        .factory('AzureStorageService', AzureStorageService);

    AzureStorageService.$inject = ['$q'];

    function AzureStorageService($q) {
        var service = {};
        service.GetContainer = GetContainer;
        service.BuildblobService = BuildblobService;
        service.ListBlobs = ListBlobs;
        service.UploadBlob = UploadBlob;
        service.DeleteBlob = DeleteBlob;
        service.getBlobURI = getBlobURI;
        service.getKey = getKey;
        service.loadConfig = loadConfig;

        return service;

        function getBlobURI() {
            var config = Parse.Config.current();
            return config.get("storageEnv");
        }

        function getKey() {
            var config = Parse.Config.current();
            return config.get("storageKey");
        }

        function loadConfig() {

            var deferred = $q.defer();
            Parse.Config.get().then(function(config) {
                deferred.resolve({ success: true, config: config });
            }, function(error) {
                var config2 = Parse.Config.current();
                deferred.resolve({ success: true, config: config2 });
            });
            return deferred.promise;
        }

        function BuildblobService() {

            var blobUri = getBlobURI();
            var SASkey = getKey();
            var blobService = AzureStorage.createBlobServiceWithSas(blobUri, SASkey);

            return blobService;
        }

        function GetContainer(container) {
            var blobService = BuildblobService();
            if (!blobService)
                return;

            if (!AzureStorage.Validate.containerNameIsValid(container, function(err, res) {})) {
                alert('Invalid container name!');
                return;
            }

            blobService.createContainerIfNotExists(container, function(error, result) {
                if (error) {
                    alert('Create container failed, open brower console for more detailed info.');
                    console.log(error);
                }
            });
        }

        function ListBlobs(container) {
            var blobService = BuildblobService();
            blobService.listBlobsSegmented(container, null, function(error, results) {
                if (error) {
                    return error;
                } else {
                    return results;
                }
            });
        }

        function UploadBlob(container, file_name, file, f) {

            var blobService = BuildblobService();
            GetContainer(container);

            var customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
            var fileName = file_name;
            var options = {
                storeBlobContentMD5: false,
                blockSize: customBlockSize
            };
            blobService.singleBlobPutThresholdInBytes = customBlockSize;

            var speedSummary = blobService.createBlockBlobFromBrowserFile(container, fileName, file, options, f);
            return speedSummary;
        }

        function DeleteBlob(container, blob) {

            var blobService = BuildblobService();

            blobService.deleteBlobIfExists(container, blob, function(error, result) {
                if (error) {
                    // Delete blob failed
                } else {
                    // Delete blob successfully
                }
            });
        }

    }

})();