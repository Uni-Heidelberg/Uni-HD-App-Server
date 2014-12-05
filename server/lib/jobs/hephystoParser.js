var app = require('../../server');
var request = require('request');
var async = require('async');

var md = require('html-md');

var NewsSource = app.models.NewsSource;
var NewsEvent = app.models.NewsEvent;

var nullOrString = function (testStr) {
    return testStr.length > 0 ? testStr : null;
};

module.exports = function (agenda) {
    agenda.define(
        'parse hephysto',
        function (job, done) {
            console.log('Starting parsing hephysto data');

            NewsSource.find({
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
                        if (!(hephysto.options && hephysto.options.hephysto && hephysto.options.hephysto.url)) {
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

                                        NewsEvent.findOrCreate(
                                            {
                                                where: {
                                                    urlHash: eventData.urlHash
                                                }
                                            },
                                            eventData,
                                            function (err, event) {
                                                if (err) {
                                                    callback(err);
                                                    return;
                                                }

                                                event.title = eventData.title;
                                                event.date = eventData.date;
                                                event.abstract = eventData.abstract;
                                                event.building = eventData.building;
                                                event.room = eventData.room;
                                                event.url = eventData.url;

                                                event.speakerName = eventData.speakerName;
                                                event.speakerAffiliation = eventData.speakerAffiliation;
                                                event.speakerUrl = eventData.speakerUrl;
                                                event.speakerEmail = eventData.speakerEmail;

                                                event.save();

                                                callback(null);
                                            }
                                        );
                                    },
                                    function (err) {
                                        callback(err);
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
