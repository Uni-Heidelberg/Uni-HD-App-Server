var app = require('../../server');
var request = require('request');

var NewsEventSource = app.models.NewsEventSource;

var urls = {
    all: 'http://www.physik.uni-heidelberg.de/hephysto/tools/seminarinfo.php',
    base: 'http://www.physik.uni-heidelberg.de/hephysto/tools/seminarinfo.php?id='
};

var nullOrString = function(testStr) {
    return testStr.length > 0 ? testStr : null;
};

module.exports = function (agenda) {
    agenda.define(
        'reload hephysto sources',
        function (job, done) {
            console.log('Reload hephysto sources');
            var data = job.attrs.data;

            request(
                {
                    url: urls.all,
                    json: true
                },
                function (error, response, talkSeries) {
                    if (error || response.statusCode != 200) {
                        console.log(error);
                        console.log(response.statusCode);
                        return;
                    }

                    NewsEventSource.find({
                            "where": {
                                "type": "hephysto"
                            }
                        }, function (err, eventSources) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            var notToInsertIds = [];

                            for (var dbI = 0; dbI < eventSources.length; dbI++) {
                                var eventSource = eventSources[dbI];

                                var found = false;

                                for (var sId = 0; sId < talkSeries.length; sId++) {
                                    var talkSerie = talkSeries[sId];

                                    if (eventSource.options === null) {
                                        NewsEventSource.destroyById(eventSource.id);
                                        break;
                                    }
                                    if (eventSource.options.hephysto
                                        && eventSource.options.hephysto.id == talkSerie.eventId
                                    ) {
                                        found = true;
                                        notToInsertIds.push(talkSerie.eventId);

                                        eventSource.name = talkSerie.name;
                                        eventSource.url = talkSerie.website;
                                        eventSource.options.building = talkSerie.building;
                                        eventSource.options.room = talkSerie.room;
                                        eventSource.options.defaultDate = talkSerie.dateTime;

                                        eventSource.categoryId = data.categoryId;

                                        eventSource.save();
                                        break;
                                    }
                                }

                                if(!found) {
                                    NewsEventSource.destroyById(eventSource.id);
                                }
                            }

                            for (var i = 0; i < talkSeries.length; i++) {
                                var talkSerie = talkSeries[i];
                                if(notToInsertIds.indexOf(talkSerie.eventId) != -1) {
                                    continue;
                                }

                                var eventSourceData = {
                                    name: talkSerie.name,
                                    type: 'hephysto',
                                    url: nullOrString(talkSerie.website),
                                    options: {
                                        hephysto: {
                                            id: talkSerie.eventId,
                                            url: urls.base + talkSerie.eventId,
                                            building: talkSerie.building,
                                            room: talkSerie.room,
                                            defaultDate: talkSerie.dateTime
                                        }
                                    },
                                    categoryId: data.categoryId
                                };

                                NewsEventSource.create(eventSourceData, function(err, eventSource) {
                                    if(err) {
                                        console.warn('reload hephysto sources:');
                                        console.warn(err.message);
                                    }
                                });
                            }

                            done();
                        }
                    );
                }
            );
        }
    );
};
