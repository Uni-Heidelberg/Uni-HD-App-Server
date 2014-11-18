module.exports = function (app) {

    var db = app.datasources.appserver;

    var NewsCategory = app.models.NewsCategory;
    var NewsSource = app.models.NewsSource;
    var NewsItem = app.models.NewsItem;

    var feedRead = require('feed-read');
    var crypto = require('crypto');
    var request = require('request');

    // Parse RSS Feeds
    NewsSource.prototype.fetchItems = function () {
        console.log('Fetching items from', this.url, '...');
        var sourceId = this.id;
        feedRead(
            this.url,
            function (err, articles) {
                if (err)
                    throw err;
                for (var i in articles) {
                    var article = articles[i];
                    if (article.link.indexOf('http://') === -1) {
                        article.link = 'http://' + article.link;
                    }
                    var itemData = {
                        sourceId: sourceId,
                        title: article.title,
                        date: article.published,
                        abstract: article.content,
                        url: article.link
                    };
                    request.get(article.link, function (err, res) {
                        if (err) {
                            return;
                        }
                        itemData.url = res.request.uri.href;
                        itemData.urlHash = crypto.createHash('sha1').update(res.request.uri.href).digest('hex');
                        NewsItem.findOrCreate(
                            {where: {urlHash: itemData.urlHash}},
                            itemData,
                            function (err, item) {
                                //console.log(err);
                            }
                        );
                    });
                }
            }
        );
    };

    function generateSampleData() {
        NewsCategory.count(function (err, count) {
            if (count === 0) {
                console.log('No data in database, generating sample data...');
                NewsCategory.create({
                    title: 'Universität Heidelberg'
                }, function (err, category) {
                    NewsSource.create({
                        title: 'Pressestelle der Universität Heidelberg',
                        url: 'http://www.uni-heidelberg.de/presse/rss.xml',
                        categoryId: category.id
                    }, function (err, source) {
                        source.fetchItems();
                    });
                });
                NewsCategory.create({
                    title: 'Physik'
                }, function (err, category) {
                    NewsSource.create({
                        title: 'Fakultät für Physik und Astronomie',
                        url: 'http://www.physik.uni-heidelberg.de/aktuelles/rss/rss.xml',
                        categoryId: category.id
                    }, function (err, source) {
                        source.fetchItems();
                    });
                    NewsSource.create({
                        title: 'Kirchhoff Institut für Physik',
                        url: 'http://www.kip.uni-heidelberg.de/rss/rss.xml',
                        categoryId: category.id
                    }, function (err, source) {
                        source.fetchItems();
                    });
                });
            }
        });
    }

    db.isActual(function (err, actual) {
        if (!actual) {
            console.log('Database needs update, automigrating table structure from model...');
            db.automigrate(function () {
                generateSampleData();
            });
        } else {
            generateSampleData();
        }
    });
};
