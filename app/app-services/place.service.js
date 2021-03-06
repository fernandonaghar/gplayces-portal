﻿(function() {
    'use strict';

    angular
        .module('app')
        .factory('PlaceService', PlaceService);

    PlaceService.$inject = ['$http', '$q', 'AzureStorageService', '$translate'];

    function PlaceService($http, $q, AzureStorageService, $translate) {
        var service = {};
        service.GetCreatedPlaces = GetCreatedPlaces;
        service.GetOwnedPlaces = GetOwnedPlaces;
        service.SearchPlaces = SearchPlaces;
        service.GetPlaceCategories = GetPlaceCategories;
        service.GetcoverImageURL = GetcoverImageURL;

        service.GetPlaceHours = GetPlaceHours;
        service.AddPlaceHours = AddPlaceHours;
        service.RemovePlaceHours = RemovePlaceHours;

        service.AddPlacePicture = AddPlacePicture;
        service.GetPlacePictures = GetPlacePictures;
        service.RemovePlacePicture = RemovePlacePicture;
        service.UpdatePlacePicturePosition = UpdatePlacePicturePosition;
        service.PlacePictureParseToAngularObject = PlacePictureParseToAngularObject;

        service.SavePlace = SavePlace;
        service.ParseToAngularObject = ParseToAngularObject;

        service.CreatePlaceAdministrationRequest = CreatePlaceAdministrationRequest;
        service.GetMyApprovalRequests = GetMyApprovalRequests;
        service.GetPendingApprovalRequests = GetPendingApprovalRequests;
        service.cancelAdministrationRequest = cancelAdministrationRequest;
        service.ApproveAdministrationRequest = ApproveAdministrationRequest;
        service.DenyAdministrationRequest = DenyAdministrationRequest;

        return service;

        function GetCreatedPlaces() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Place = Parse.Object.extend("Place");

            var query = new Parse.Query(Place);
            query.equalTo("creator", parse_user);
            query.equalTo("owner", null);
            query.equalTo("approvalStatus", null);
            query.include(["city", "category"]);
            query.descending("createdAt");
            query.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetMyApprovalRequests() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Request = Parse.Object.extend("PlaceAdministrationRequest");

            var query = new Parse.Query(Request);
            query.equalTo("requestUser", parse_user);
            query.equalTo("status", "Requested");
            query.include(["place"]);
            query.descending("createdAt");
            query.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetPendingApprovalRequests() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Request = Parse.Object.extend("PlaceAdministrationRequest");

            var query = new Parse.Query(Request);
            query.equalTo("status", "Requested");
            query.include(["place"]);
            query.ascending("createdAt");
            query.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function SearchPlaces(searchcategory, searchcity, searchobj) {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Place = Parse.Object.extend("Place");

            var query1 = new Parse.Query(Place);
            query1.equalTo("city", searchcity);

            if (searchcategory == 0) {
                query1.matches("name", searchobj);
            } else if (searchcategory == 1) {
                query1.matches("address", searchobj);
            } else if (searchcategory == 2) {
                query1.equalTo("category", searchobj);
            }

            query1.include(["city", "category"]);
            query1.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });

                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        object.isOwner = true;
                    }
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetOwnedPlaces() {

            var deferred = $q.defer();
            var parse_user = Parse.User.current();
            var Place = Parse.Object.extend("Place");

            var query1 = new Parse.Query(Place);
            query1.equalTo("owner", parse_user);
            query1.include(["city", "category"]);
            query1.descending("createdAt");

            query1.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });

                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        object.isOwner = true;
                    }
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetPlaceById(id) {

            var deferred = $q.defer();
            var Place = Parse.Object.extend("Place");
            var query = new Parse.Query(Place);
            query.include(["city", "category"]);
            query.get(id, {
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function GetPlaceCategories() {

            var deferred = $q.defer();
            var Category = Parse.Object.extend("Category");
            var query = new Parse.Query(Category);
            query.equalTo("active", true);
            query.find({
                success: function(results) {

                    var currentLanguage = $translate.use();
                    for (var i = 0; i < results.length; i++) {

                        if (currentLanguage == 'ptb') {
                            results[i].translatedName = results[i].attributes.namePT;
                        } else if (currentLanguage == 'esp') {
                            results[i].translatedName = results[i].attributes.nameES;
                        } else {
                            results[i].translatedName = results[i].attributes.nameEN;
                        }

                    }
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function SavePlace(place) {

            var deferred = $q.defer();
            var parse_object;

            if (place.id != null) {
                GetPlaceById(place.id).then(function(response) {
                    if (response != null) {
                        if (response.parse_data != null) {
                            parse_object = response.parse_data;
                            parse_object = SetPlaceData(place, parse_object);
                            parse_object.save(null, {
                                success: function(parse_object) {
                                    deferred.resolve({ success: true, place: parse_object });
                                },
                                error: function(parse_user, error) {
                                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                                }
                            }).catch(angular.noop);
                        } else {
                            var Place = Parse.Object.extend("Place");
                            parse_object = new Place();
                            var parse_user = Parse.User.current();
                            parse_object.set("creator", parse_user);
                            parse_object = SetPlaceData(place, parse_object);
                            parse_object.save(null, {
                                success: function(parse_object) {
                                    deferred.resolve({ success: true, place: parse_object });
                                },
                                error: function(parse_object, error) {
                                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                                }
                            }).catch(angular.noop);
                        }
                    }
                }).catch(angular.noop);
            } else { // new place
                var Place = Parse.Object.extend("Place");
                parse_object = new Place();
                var parse_user = Parse.User.current();
                parse_object.set("creator", parse_user);
                parse_object.set("priority", 0);
                parse_object = SetPlaceData(place, parse_object);
                parse_object.save(null, {
                    success: function(parse_object) {
                        // save PlaceRating when creating Place
                        var PlaceRating = Parse.Object.extend("PlaceRating");
                        var parseChildObject = new PlaceRating();

                        parseChildObject.set("place", parse_object);
                        parseChildObject.set("totalRating", 0);
                        parseChildObject.set("customByCategory", 0);
                        parseChildObject.set("attendance", 0);
                        parseChildObject.set("costBenefit", 0);
                        parseChildObject.set("numberOfRatings", 0);
                        parseChildObject.set("ambience", 0);

                        parseChildObject.save(null, {
                            success: function(parseChildObject) {
                                // update reference on place
                                parse_object.set("placeRating", parseChildObject);
                                parse_object.save(null, {
                                    success: function(parse_object) {
                                        deferred.resolve({ success: true, place: parse_object });
                                    },
                                    error: function(parseChildObject, error) {
                                        deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                                    }
                                });
                            },
                            error: function(parseChildObject, error) {
                                deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                            }
                        }).catch(angular.noop);
                    },
                    error: function(parse_user, error) {
                        deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                    }
                }).catch(angular.noop);
            }
            return deferred.promise;
        }

        function SetPlaceData(place, parse_object) {

            parse_object.set("name", place.name);
            parse_object.set("city", place.city);
            parse_object.set("category", place.category);
            parse_object.set("descriptionPT", place.descriptionPT);
            parse_object.set("descriptionEN", place.descriptionEN);
            parse_object.set("descriptionES", place.descriptionES);
            parse_object.set("telephone", place.telephone);
            parse_object.set("address", place.address);
            parse_object.set("email", place.email);
            parse_object.set("instagram", place.instagram);
            parse_object.set("twitter", place.twitter);
            parse_object.set("facebook", place.facebook);
            parse_object.set("site", place.site);
            parse_object.set("approvalStatus", place.approvalStatus);
            parse_object.set("approvalRequest", place.approvalRequest);
            parse_object.set("coverImage", place.coverImage);
            parse_object.set("priority", place.priority);
            parse_object.set("isAccessible", place.isAccessible);
            parse_object.set("isActive", place.isActive);

            if (place.latitude != null && place.longitude != null) {
                var point = new Parse.GeoPoint({ latitude: place.latitude, longitude: place.longitude });
                parse_object.set("location", point);
            }

            return parse_object;
        }

        function GetcoverImageURL(angular_place) {
            if (angular_place.coverImage) {
                return AzureStorageService.getBlobURI() + '/place/' + angular_place.coverImage;
            }
            else
            {
                return "";
            }
        }

        function PlacePictureParseToAngularObject(parse_object) {

            var angular_object = [];
            angular_object.id = parse_object.id;
            angular_object.position = parse_object.attributes.position;
            angular_object.fileURL = parse_object.attributes.fileURL;
            angular_object.place = parse_object.attributes.place;
            angular_object.parse_object = parse_object;

            angular_object.image = AzureStorageService.getBlobURI() + '/place/' + parse_object.attributes.fileURL;

            return angular_object;
        }

        function ParseToAngularObject(parse_object) {

            var angular_object = [];
            angular_object.id = parse_object.id;
            angular_object.name = parse_object.attributes.name;
            angular_object.city = parse_object.attributes.city;
            angular_object.category = parse_object.attributes.category;
            angular_object.descriptionPT = parse_object.attributes.descriptionPT;
            angular_object.descriptionEN = parse_object.attributes.descriptionEN;
            angular_object.descriptionES = parse_object.attributes.descriptionES;
            angular_object.telephone = parse_object.attributes.telephone;
            angular_object.email = parse_object.attributes.email;
            angular_object.instagram = parse_object.attributes.instagram;
            angular_object.twitter = parse_object.attributes.twitter;
            angular_object.facebook = parse_object.attributes.facebook;
            angular_object.site = parse_object.attributes.site;
            angular_object.location = parse_object.attributes.location;
            angular_object.approvalStatus = parse_object.attributes.approvalStatus;
            angular_object.approvalRequest = parse_object.attributes.approvalRequest;
            angular_object.coverImage = parse_object.attributes.coverImage;

            angular_object.isActive = parse_object.attributes.isActive;
            angular_object.isAccessible = parse_object.attributes.isAccessible;            

            if (parse_object.attributes.owner != null) {
                var current_user = Parse.User.current();
                if (parse_object.attributes.owner.id == current_user.id) {
                    angular_object.isOwner = true;
                }
            } else {
                angular_object.isOwner = false;
            }

            if (parse_object.attributes.location != null) {
                angular_object.latitude = Number(parse_object.attributes.location.latitude);
                angular_object.longitude = Number(parse_object.attributes.location.longitude);
            }
            angular_object.address = parse_object.attributes.address;
            angular_object.parse_object = parse_object;

            return angular_object;
        }

        function CreatePlaceAdministrationRequest(place, request) {

            var deferred = $q.defer();
            var parse_object;

            var Request = Parse.Object.extend("PlaceAdministrationRequest");
            parse_object = new Request();

            var parse_user = Parse.User.current();
            parse_object.set("requestUser", parse_user);
            parse_object.set("place", place.parse_object);
            parse_object.set("status", "Requested");
            parse_object.set("requestComments", request.adminrequest.requestComments);
            parse_object.set("attachmentFileName", request.filename);
            parse_object.save(null, {
                success: function(parse_object) {

                    place.parse_object.set("approvalStatus", "Pending");
                    place.parse_object.set("approvalRequest", parse_object);

                    place.parse_object.save(null, {
                        success: function(parse_object) {
                            deferred.resolve({ success: true, request: parse_object });
                        },
                        error: function(parse_user, error) {
                            deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                        }
                    });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function cancelAdministrationRequest(request) {

            var deferred = $q.defer();

            request.set("status", "Cancelled");
            request.save(null, {
                success: function(parse_object) {

                    request.attributes.place.set("approvalStatus", null);
                    request.attributes.place.set("approvalRequest", null);
                    request.attributes.place.save(null, {
                        success: function(parse_object2) {
                            deferred.resolve({ success: true, request: parse_object2 });
                        },
                        error: function(parse_object2, error) {
                            deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                        }
                    });
                },
                error: function(parse_object, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function ApproveAdministrationRequest(request, approvalComment) {

            var deferred = $q.defer();

            request.set("status", "Approved");
            request.set("reviewer", Parse.User.current());
            request.set("aprovalComments", approvalComment);
            request.save(null, {
                success: function(parse_object) {

                    request.attributes.place.set("approvalStatus", "Approved");
                    request.attributes.place.set("owner", request.attributes.requestUser);
                    request.attributes.place.save(null, {
                        success: function(parse_object2) {
                            deferred.resolve({ success: true, request: parse_object2 });
                        },
                        error: function(parse_object2, error) {
                            deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                        }
                    });
                },
                error: function(parse_object, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function DenyAdministrationRequest(request, approvalComment) {

            var deferred = $q.defer();

            request.set("status", "Denied");
            request.set("reviewer", Parse.User.current());
            request.set("aprovalComments", approvalComment);
            request.save(null, {
                success: function(parse_object) {

                    request.attributes.place.set("approvalStatus", null);
                    request.attributes.place.set("approvalRequest", null);
                    request.attributes.place.save(null, {
                        success: function(parse_object2) {
                            deferred.resolve({ success: true, request: parse_object2 });
                        },
                        error: function(parse_object2, error) {
                            deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                        }
                    });
                },
                error: function(parse_object, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function GetPlaceHours(parse_place) {

            var deferred = $q.defer();
            var PlaceHours = Parse.Object.extend("PlaceHours");
            var query = new Parse.Query(PlaceHours);
            query.equalTo("place", parse_place);
            query.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function AddPlaceHours(parse_place, hours) {

            var deferred = $q.defer();
            var parse_object;

            var PlaceHours = Parse.Object.extend("PlaceHours");
            parse_object = new PlaceHours();

            var parse_user = Parse.User.current();
            parse_object.set("day", hours.dayId);
            parse_object.set("place", parse_place);
            parse_object.set("startDay", hours.startDay);
            parse_object.set("endDay", hours.endDay);
            parse_object.set("startNight", hours.startNight);
            parse_object.set("endNight", hours.endNight);            

            parse_object.save(null, {
                success: function(parse_object) {
                    deferred.resolve({ success: true, parse_object: parse_object });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function RemovePlaceHours(parse_object) {
            parse_object.destroy(null, {}).catch(angular.noop);
        }


        function AddPlacePicture(parse_place, filename, position) {

            var deferred = $q.defer();
            var parse_object;

            var PlacePictures = Parse.Object.extend("PlacePictures");
            parse_object = new PlacePictures();

            parse_object.set("place", parse_place);
            parse_object.set("fileURL", filename);
            parse_object.set("position", position);

            parse_object.save(null, {
                success: function(parse_object) {
                    deferred.resolve({ success: true, parse_object: parse_object });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function UpdatePlacePicturePosition(parse_object, position) {

            var deferred = $q.defer();

            parse_object.set("position", position);

            parse_object.save(null, {
                success: function(parse_object) {
                    deferred.resolve({ success: true, parse_object: parse_object });
                },
                error: function(parse_user, error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            }).catch(angular.noop);

            return deferred.promise;
        }

        function GetPlacePictures(parse_place) {

            var deferred = $q.defer();
            var PlacePictures = Parse.Object.extend("PlacePictures");
            var query = new Parse.Query(PlacePictures);
            query.equalTo("place", parse_place);
            query.find({
                success: function(results) {
                    deferred.resolve({ success: true, parse_data: results });
                },
                error: function(error) {
                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                }
            });
            return deferred.promise;
        }

        function RemovePlacePicture(parse_object) {
            parse_object.destroy(null, {}).catch(angular.noop);
        }

    }

})();