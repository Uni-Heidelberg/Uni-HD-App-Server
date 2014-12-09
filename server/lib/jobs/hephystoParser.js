var app = require('../../server');
var request = require('request');
var async = require('async');

var md = require('html-md');

var NewsSource = app.models.NewsSource;
var NewsTalk = app.models.NewsTalk;

var nullOrString = function (testStr) {
    return testStr.length > 0 ? testStr : null;
};

module.exports = function (agenda) {
    agenda.define(
        'parse hephysto',
        function (job, done) {
            console.log('Starting parsing hephysto data');

            NewsSource.find({
                'where': {
                    'type': 'hephysto'
                }
            }, function (err, hephystos) {
                if (err) {
                    return console.warn('hephystoParser', err);
                }
                async.each(
                    hephystos,
                    function (hephysto, callback) {
                        if (!(hephysto.options && hephysto.options.hephysto && hephysto.options.hephysto.url)) {
                            return callback('invalid hephysto source');
                        }
                        request(
                            {
                                url: hephysto.options.hephysto.url,
                                json: true
                            }, function (err, response, body) {
                                if (err || response.statusCode !== 200) {
                                    console.warn('hephystoParser', err);
                                    return callback('request error');
                                }
                                async.each(
                                    body,
                                    function (hephystoTalk, callback) {
                                        var talkData = {
                                            title: hephystoTalk.title,
                                            date: hephystoTalk.date,
                                            abstract: nullOrString(hephystoTalk.abstract),
                                            building: md(hephystoTalk.building),
                                            room: md(hephystoTalk.room),
                                            url: hephystoTalk.url,

                                            source: hephysto,

                                            speakerName: nullOrString(hephystoTalk.speaker.name),
                                            speakerAffiliation: nullOrString(hephystoTalk.speaker.affiliation),
                                            speakerUrl: nullOrString(hephystoTalk.speaker.url),
                                            speakerEmail: nullOrString(hephystoTalk.speaker.email)
                                        };

                                        talkData.urlHash =
                                            'hephysto:' + hephystoTalk.talkSeriesId + ':' + hephystoTalk.talkId;

                                        NewsTalk.findOrCreate(
                                            {
                                                where: {
                                                    urlHash: talkData.urlHash
                                                }
                                            },
                                            talkData,
                                            function (err, talk) {
                                                if (err) {
                                                    return callback(err);
                                                }

                                                talk.title = talkData.title;
                                                talk.date = talkData.date;
                                                talk.abstract = talkData.abstract;
                                                talk.building = talkData.building;
                                                talk.room = talkData.room;
                                                talk.url = talkData.url;

                                                talk.speakerName = talkData.speakerName;
                                                talk.speakerAffiliation = talkData.speakerAffiliation;
                                                talk.speakerUrl = talkData.speakerUrl;
                                                talk.speakerEmail = talkData.speakerEmail;

                                                talk.save();

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
                            console.warn('hephystoParser', err);
                        }
                    }
                );
            });

            done();
        }
    );
};
