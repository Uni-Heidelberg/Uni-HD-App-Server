var app = require('../../server.js');

var feedRead = require('feed-read');
var crypto = require('crypto');
var request = require('request');
var async = require('async');

var NewsSource = app.models.NewsSource;
var NewsItem = app.models.NewsItem;

module.exports = function (agenda) {
    agenda.define(
        'reloading news',
        function (job, done) {
            NewsSource.find(function (err, sources) {
                async.each(
                    sources,
                    function (source, callback) {
                        console.log('Updating feed...' + source.url);
                        feedRead(
                            source.url,
                            function (err, articles) {
                                if (err)
                                    throw err;
                                async.each(
                                    articles,
                                    (function (source) {
                                        return function (article, callback) {
                                            if (!article.published || article.published.getFullYear() < 2010) {
                                                return;
                                            }
                                            if (article.link.indexOf('http://') === -1) {
                                                article.link = 'http://' + article.link;
                                            }
                                            var itemData = {
                                                sourceId: source.id,
                                                title: article.title,
                                                date: article.published,
                                                abstract: article.content,
                                                url: article.link
                                            };
                                            request.get(
                                                article.link,
                                                (function (itemData) {
                                                    return function (err, res) {
                                                        if (err) {
                                                            return;
                                                        }
                                                        itemData.url = res.request.uri.href;
                                                        itemData.urlHash = crypto.createHash('sha1').update(res.request.uri.href).digest('hex');
                                                        NewsItem.findOrCreate(
                                                            {where: {urlHash: itemData.urlHash}},
                                                            itemData,
                                                            function (err, item) {
                                                                if (err) {
                                                                    console.log(err);
                                                                }
                                                            }
                                                        );
                                                    };
                                                })(itemData)
                                            );
                                        };
                                    })(source)
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
