var app = require('../../server');

var feedRead = require('feed-read');
var crypto = require('crypto');
var request = require('request');
var async = require('async');

var md = require('html-md');

var NewsSource = app.models.NewsSource;
var NewsArticle = app.models.NewsArticle;


module.exports = function (agenda) {
    agenda.define(
        'parse feeds',
        function (job, done) {
            console.log('Starting parsing news feeds');

            NewsSource.find({
                "where": {
                    "type": "feed"
                }
            }, function (err, feeds) {
                if (err) {
                    return console.warn('feedParser: ', err);
                }
                async.each(
                    feeds,
                    parseFeed,
                    function (err) {
                        if (err) {
                            console.warn('feedParser: ', err);
                        }
                    }
                );
            });

            done();
        }
    );
};

var parseFeed = function (feed, callback) {
    if (!feed instanceof app.models.NewsSource) {
        throw "wrong data type supplied";
    }

    console.log('Updating feed...' + feed.url);
    feedRead(
        feed.url,
        function (err, articles) {
            if (err) {
                return console.warn('feedParser', err);
            }
            async.each(
                articles,
                makeFeedArticleParser(feed)
            );
        }
    );
};

var makeFeedArticleParser = function (feed) {
    return function (feedArticle, callback) {
        if (
            !feedArticle.published
            || feedArticle.published.getFullYear() < 2010
            || feedArticle.content.length < 5
            || feedArticle.published.toString() === 'Invalid Date'
        ) {
            return callback(null);
        }
        if (feedArticle.link.indexOf('http://') === -1) {
            feedArticle.link = 'http://' + feedArticle.link;
        }
        var articleData = {
            title: feedArticle.title,
            date: feedArticle.published,
            abstract: md(feedArticle.content),
            url: feedArticle.link
        };
        request.get(
            feedArticle.link,
            (function (articleData, feed) {
                return function (err, res) {
                    if (err) {
                        return console.warn('feedParser', err);
                    }
                    articleData.url = res.request.uri.href;
                    articleData.urlHash =
                        crypto
                            .createHash('sha1')
                            .update(res.request.uri.href)
                            .digest('hex');
                    NewsArticle.findOrCreate(
                        {where: {urlHash: articleData.urlHash}},
                        articleData,
                        function (err, article) {
                            if (err) {
                                return console.warn('feedParser', err);
                            }
                            article.title = articleData.title;
                            article.date = articleData.date;
                            article.abstract =
                                articleData
                                    .abstract
                                    .replace(/\\/, '')
                                    .replace(/\\\./, '.');
                            article.source(feed);
                            article.save();

                            callback(null);
                        }
                    );
                };
            })(articleData, feed, callback)
        );
    };
};
