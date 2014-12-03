var app = require('../../server');

var feedRead = require('feed-read');
var crypto = require('crypto');
var request = require('request');
var async = require('async');

var md = require('html-md');

var NewsEventSource = app.models.NewsEventSource;
var NewsItem = app.models.NewsItem;


module.exports = function (agenda) {
    agenda.define(
        'parse feeds',
        function (job, done) {
            console.log('Starting parsing news feeds');

            NewsEventSource.find({
                "where": {
                    "type": "feed"
                }
            }, function (err, feeds) {
                if (err) {
                    console.log(err);
                    return;
                }
                async.each(
                    feeds,
                    parseFeed,
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

var parseFeed = function (feed, callback) {
    if (!feed instanceof app.models.NewsEventSource) {
        throw "wrong data type supplied";
    }

    console.log('Updating feed...' + feed.url);
    feedRead(
        feed.url,
        function (err, articles) {
            if (err)
                throw err;
            async.each(
                articles,
                makeArticleParser(feed)
            );
        }
    );
};

var makeArticleParser = function (feed) {
    return function (article, callback) {
        if (
            !article.published || article.published.getFullYear() < 2010
            || article.content.length < 5
            || article.published.toString() === 'Invalid Date'
        ) {
            return;
        }
        if (article.link.indexOf('http://') === -1) {
            article.link = 'http://' + article.link;
        }
        var itemData = {
            title: article.title,
            date: article.published,
            abstract: md(article.content),
            url: article.link
        };
        request.get(
            article.link,
            (function (itemData, feed) {
                return function (err, res) {
                    if (err) {
                        return;
                    }
                    itemData.url = res.request.uri.href;
                    itemData.urlHash =
                        crypto
                            .createHash('sha1')
                            .update(res.request.uri.href)
                            .digest('hex');
                    NewsItem.findOrCreate(
                        {where: {urlHash: itemData.urlHash}},
                        itemData,
                        function (err, item) {
                            if (err) {
                                console.log(err);
                            }
                            item.title = itemData.title;
                            item.date = itemData.date;
                            item.abstract =
                                itemData
                                    .abstract
                                    .replace(/\\/, '')
                                    .replace(/\\\./, '.');
                            item.source(feed);
                            item.save();

                            callback(null);
                        }
                    );
                };
            })(itemData, feed, callback)
        );
    };
};
