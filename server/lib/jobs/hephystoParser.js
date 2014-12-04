var app = require('../../server');
var request = require('request');
var async = require('async');

var md = require('html-md');

var NewsEventSource = app.models.NewsEventSource;
var EventItem = app.models.EventItem;

var nullOrString = function(testStr) {
    return testStr.length > 0 ? testStr : null;
};

module.exports = function (agenda) {
    agenda.define(
        'parse hephysto',
        function (job, done) {
            console.log('Starting parsing hephysto data');

            NewsEventSource.find({
                "where": {
                    "type": "hephysto"
                }
            }, function (err, hephystos) {
                if (err) {
                    console.warn(err);
                    return;
                }
                async.each(
                    hephystos,
                    function (hephysto, callback) {
                        if(!(hephysto.options && hephysto.options.hephysto && hephysto.options.hephysto.url)) {
                            callback('invalid hephysto source');
                            return;
                        }
                        request(
                            {
                                url: hephysto.options.hephysto.url,
                                json: true
                            }, function (err, response, body) {
                                if (err || response.statusCode != 200) {
                                    console.warn(err);
                                    console.warn(response.statusCode);
                                    callback('request error');
                                    return;
                                }
                                async.each(
                                    body,
                                    function (hephystoTalk, callback) {
                                        var eventData = {
                                            title: hephystoTalk.title,
                                            date: hephystoTalk.date,
                                            abstract: nullOrString(hephystoTalk.abstract),
                                            building: md(hephystoTalk.building),
                                            room: md(hephystoTalk.room),
                                            url: hephystoTalk.url,
                                            urlHash: 'hephysto:' + hephystoTalk.talkSeriesId + ':' + hephystoTalk.talkId,

                                            source: hephysto,

                                            speakerName: nullOrString(hephystoTalk.speaker.name),
                                            speakerAffiliation: nullOrString(hephystoTalk.speaker.affiliation),
                                            speakerUrl: nullOrString(hephystoTalk.speaker.url),
                                            speakerEmail: nullOrString(hephystoTalk.speaker.email)
                                        };

                                        EventItem.findOrCreate(
                                            {
                                                where: {
                                                    urlHash: eventData.urlHash
                                                }
                                            },
                                            eventData,
                                            function (err, eventItem) {
                                                if (err) {
                                                    callback(err);
                                                    return;
                                                }

                                                eventItem.title = eventData.title;
                                                eventItem.date = eventData.date;
                                                eventItem.abstract = eventData.abstract;
                                                eventItem.building = eventData.building;
                                                eventItem.room = eventData.room;
                                                eventItem.url = eventData.url;

                                                eventItem.speakerName = eventData.speakerName;
                                                eventItem.speakerAffiliation = eventData.speakerAffiliation;
                                                eventItem.speakerUrl = eventData.speakerUrl;
                                                eventItem.speakerEmail = eventData.speakerEmail;

                                                eventItem.save();

                                                callback(null);
                                            }
                                        );
                                    },
                                    function (err) {
                                        if (err) {
                                            console.warn(err);
                                        }
                                    }
                                );
                            }
                        );
                    },
                    function (err) {
                        if (err) {
                            console.warn(err);
                        }
                    }
                );
            });

            done();
        }
    );
};
