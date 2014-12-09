var app = require('../../server');
var request = require('request');

var NewsSource = app.models.NewsSource;

var urls = {
    all: 'http://www.physik.uni-heidelberg.de/hephysto/tools/seminarinfo.php',
    base: 'http://www.physik.uni-heidelberg.de/hephysto/tools/seminarinfo.php?id='
};

var nullOrString = function (testStr) {
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
                    if (error || response.statusCode !== 200) {
                        console.log(error);
                        console.log(response.statusCode);
                        done(null);
                        return;
                    }

                    NewsSource.find({
                            'where': {
                                'type': 'hephysto'
                            }
                        }, function (err, sources) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            var notToInsertIds = [];

                            sources.forEach(function (source) {
                                var found = false;

                                talkSeries.forEach(
                                    function (talkSerie) {
                                        if (source.options === null) {
                                            NewsSource.destroyById(source.id);
                                            return;
                                        }
                                        if (
                                            source.options.hephysto &&
                                            source.options.hephysto.id === talkSerie.eventId
                                        ) {
                                            found = true;
                                            notToInsertIds.push(talkSerie.eventId);

                                            source.name = talkSerie.name;
                                            source.url = talkSerie.website;
                                            source.options.building = talkSerie.building;
                                            source.options.room = talkSerie.room;
                                            source.options.defaultDate = talkSerie.dateTime;

                                            source.categoryId = data.categoryId;

                                            source.save();
                                            return;
                                        }
                                    }
                                );

                                if (!found) {
                                    NewsSource.destroyById(source.id);
                                }
                            });

                            talkSeries.forEach(function (talkSerie) {
                                if (notToInsertIds.indexOf(talkSerie.eventId) !== -1) {
                                    return;
                                }

                                var sourceData = {
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

                                NewsSource.create(sourceData, function (err, source) {
                                    if (err) {
                                        console.warn(
                                            'reload hephysto sources:',
                                            err,
                                            source
                                        );
                                    }
                                });
                            });

                            if (job.attrs.type === 'normal') {
                                job.remove(function () {
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
