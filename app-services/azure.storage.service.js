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
        service.getBlobURI = getBlobURI;
        service.getKey = getKey;

        return service;

        function getBlobURI() {
            return 'https://gplaycesstorage.blob.core.windows.net';
        }

        function getKey() {
            return '?sv=2017-04-17&ss=b&srt=sco&sp=rwdlac&se=2017-11-30T20:48:03Z&st=2017-10-08T12:48:03Z&sip=191.177.185.236&spr=https&sig=uWtgLxPdlDRcIlWq63fhMayi3%2BHYwQL%2BDUzIcYotkeE%3D';
        }

        function BuildblobService() {

            var blobUri = getBlobURI();
            var SASkey = getKey();
            var blobService = AzureStorage.createBlobServiceWithSas(blobUri, SASkey);
            //var blobUri = 'gplaycesstorage';
            //var key = 'dsskz8bM7PTxmBWo3RbK+Bxm5eGGkK2B/mrYz1uUfVNQwGRrIrP0XWka5Z/3ausMnEwhKWpacUrjL7e8EOtJbA==';
            //var blobService = AzureStorage.createBlobService(blobUri, key);

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
    }

})();