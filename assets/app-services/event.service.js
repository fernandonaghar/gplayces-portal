(function() {
    'use strict';

    angular
        .module('app')
        .factory('EventService', EventService);

    EventService.$inject = ['$http', '$q'];

    function EventService($http, $q) {
        var service = {};
        service.GetPlaceEvents = GetPlaceEvents;
        service.SaveEvent = SaveEvent;
        service.CancelEvent = CancelEvent;

        service.GetEventDates = GetEventDates;
        service.AddEventDate = AddEventDate;
        service.RemoveEventDate = RemoveEventDate;

        service.ParseToAngularObject = ParseToAngularObject;

        return service;

        function GetPlaceEvents(place) {

            var deferred = $q.defer();
            var Event = Parse.Object.extend("Event");

            var query = new Parse.Query(Event);
            query.equalTo("place", place);
            query.equalTo("active", true);
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

        function GetEventById(id) {

            var deferred = $q.defer();
            var Event = Parse.Object.extend("Event");
            var query = new Parse.Query(Event);
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

        function SaveEvent(place, event) {

            var deferred = $q.defer();
            var parse_object;

            if (event.id != null) {
                GetEventById(event.id).then(function(response) {
                    if (response != null) {
                        if (response.parse_data != null) {
                            parse_object = response.parse_data;
                            parse_object = SetEventData(event, parse_object);
                            parse_object.save(null, {
                                success: function(parse_object) {
                                    deferred.resolve({ success: true, object: parse_object });
                                },
                                error: function(parse_user, error) {
                                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                                }
                            }).catch(angular.noop);
                        } else {
                            var Event = Parse.Object.extend("Event");
                            parse_object = new Event();
                            parse_object.set("place", place);
                            parse_object.set("active", true);
                            parse_object = SetEventData(place, parse_object);
                            parse_object.save(null, {
                                success: function(parse_object) {
                                    deferred.resolve({ success: true, object: parse_object });
                                },
                                error: function(parse_object, error) {
                                    deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                                }
                            }).catch(angular.noop);
                        }
                    }
                }).catch(angular.noop);
            } else {
                var Event = Parse.Object.extend("Event");
                parse_object = new Event();
                parse_object.set("place", place);
                parse_object.set("active", true);
                parse_object = SetEventData(event, parse_object);
                parse_object.save(null, {
                    success: function(parse_object) {
                        deferred.resolve({ success: true, object: parse_object });
                    },
                    error: function(parse_user, error) {
                        deferred.resolve({ success: false, message: 'Erro: "' + error.code + '": ' + error.message });
                    }
                }).catch(angular.noop);
            }
            return deferred.promise;
        }

        function SetEventData(event, parse_object) {

            parse_object.set("name", event.name);
            parse_object.set("description", event.description);
            parse_object.set("coverImage", event.coverImage);

            return parse_object;
        }

        function ParseToAngularObject(parse_object) {

            var angular_object = [];
            angular_object.id = parse_object.id;
            angular_object.name = parse_object.attributes.name;
            angular_object.title = parse_object.attributes.title;
            angular_object.description = parse_object.attributes.description;
            angular_object.coverImage = parse_object.attributes.coverImage;
            angular_object.active = parse_object.attributes.active;
            angular_object.place = parse_object.attributes.place;
            angular_object.parse_object = parse_object;

            return angular_object;
        }

        function GetEventDates(event) {

            var deferred = $q.defer();
            var EventDates = Parse.Object.extend("EventDates");
            var query = new Parse.Query(EventDates);
            query.equalTo("event", event);
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

        function AddEventDate(event, date) {

            var deferred = $q.defer();
            var parse_object;

            var EventDates = Parse.Object.extend("EventDates");
            parse_object = new EventDates();

            parse_object.set("day", date.date);
            parse_object.set("event", event);
            parse_object.set("start", date.start);
            parse_object.set("end", date.end);

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

        function RemoveEventDate(parse_object) {
            parse_object.destroy(null, {}).catch(angular.noop);
        }

        function CancelEvent(parse_object) {

            var deferred = $q.defer();

            parse_object.set("active", false);
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
    }

})();