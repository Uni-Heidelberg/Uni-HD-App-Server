module.exports = function (app) {

    var db = app.datasources.appserver;

    var NewsCategory = app.models.NewsCategory;
    var NewsSource = app.models.NewsSource;
    var NewsItem = app.models.NewsItem;

    var Mensa = app.models.Mensa;
    var MensaSection = app.models.MensaSection;

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
                    request.get(article.link, (function (itemData) {
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
                                        //console.log(err);
                                    }
                                );
                            };
                        })(itemData)
                    );
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

        Mensa.count(function (err, count) {
            if (err || count !== 0) {
                return;
            }

            Mensa.create(
                {
                    'title': 'Mensa Im Neuenheimer Feld 304',
                    'location': {
                        'lat': 49.41561,
                        'lng': 8.67072
                    }
                },
                function (err, mensa) {
                    if (err)
                        throw err;

                    MensaSection.create({
                        'title': 'A+B',
                        'mensa': mensa
                    });
                    MensaSection.create({
                        'title': 'D',
                        'mensa': mensa
                    });
                    MensaSection.create({
                        'title': 'E',
                        'mensa': mensa
                    });
                }
            );
            Mensa.create(
                {
                    'title': 'zeughaus-Mensa im Marstall',
                    'location': {
                        'lat': 49.41299,
                        'lng': 8.70476
                    }
                },
                function (err, mensa) {
                    if (err)
                        throw err;

                    MensaSection.create({
                        'title': 'Buffet',
                        'mensa': mensa
                    });
                }
            );
            Mensa.create(
                {
                    'title': 'Triplex-Mensa am Uniplatz',
                    'location': {
                        'lat': 49.41068,
                        'lng': 8.70576
                    }
                },
                function (err, mensa) {
                    if (err)
                        throw err;

                    MensaSection.create({
                        'title': 'A',
                        'mensa': mensa
                    });
                    MensaSection.create({
                        'title': 'B',
                        'mensa': mensa
                    });
                    MensaSection.create({
                        'title': 'C',
                        'mensa': mensa
                    });
                }
            );
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
