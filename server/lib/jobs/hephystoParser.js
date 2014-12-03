var app = require('../../server');
var crypto = require('crypto');
var request = require('request');
var async = require('async');

var md = require('html-md');

var NewsEventSource = app.models.NewsEventSource;
var EventItem = app.models.EventItem;

module.exports = function (agenda) {
    agenda.define(
        'parse hephysto',
        function (job, done) {
            console.log('Starting hephysto data');

            NewsEventSource.find({
                "where": {
                    "type": "hephysto"
                }
            }, function (err, hepyhstos) {
                if (err) {
                    console.log(err);
                    return;
                }
                async.each(
                    hepyhstos,
                    function (hepyhsto, callback) {
                        request(
                            {
                                url: hepyhsto.url,
                                json: true
                            }, function (error, response, body) {
                                if (error || response.statusCode != 200) {
                                    console.log(error);
                                    console.log(response.statusCode);
                                }
                                async.each(
                                    body,
                                    function (hephystoTalk, callback) {
                                        // TODO: Complete information
                                        var eventData = {
                                            title: hephystoTalk.title,
                                            date: hephystoTalk.date,
                                            abstract: hephystoTalk.abstract.length > 0 ? hephystoTalk.abstract : null,
                                            url: hephystoTalk.url,
                                            urlHash: crypto.createHash('sha1')
                                                .update(hephystoTalk.url)
                                                .digest('hex'),
                                            source: hepyhsto
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
                                                    throw err;
                                                }

                                                // TODO: Updating eventItem
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    },
                    function (err) {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
            });

            done();
        }
    );
};
