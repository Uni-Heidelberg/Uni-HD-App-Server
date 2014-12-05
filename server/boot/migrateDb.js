module.exports = function (app) {

    var db = app.datasources.appserver;

    var NewsCategory = app.models.NewsCategory;
    var NewsSource = app.models.NewsSource;

    var Canteen = app.models.Canteen;
    var CanteenSection = app.models.CanteenSection;

    var User = app.models.User;
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;

    var generateSampleData = function () {
        NewsCategory.count(function (err, count) {
            if (err || count !== 0) {
                return;
            }

            console.log('No data in database, generating sample data...');
            NewsCategory.create({
                title: 'Universität Heidelberg',
                imagePath: 'something'
            }, function (err, category) {
                if (err || category === null) {
                    throw err;
                }
                NewsCategory.create({
                    title: "Pressestelle der Universität Heidelberg",
                    imagePath: 'something',
                    parent: category
                }, function (err, category) {
                    if (err || category === null) {
                        throw err;
                    }
                    NewsSource.create({
                        type: 'feed',
                        name: 'Feed der Pressestelle der Universität Heidelberg',
                        url: 'http://www.uni-heidelberg.de/presse/rss.xml',
                        category: category
                    }, function (err, source) {
                        if (err || source === null) {
                            throw err;
                        }
                    });
                });
            });

            NewsCategory.create({
                title: 'Physik',
                imagePath: 'something'
            }, function (err, category) {
                if (err || category === null) {
                    throw err;
                }

                NewsCategory.create({
                    title: 'Fakultät für Physik und Astronomie',
                    imagePath: 'something',
                    parent: category
                }, function (err, category) {
                    if (err || category === null) {
                        throw err;
                    }
                    NewsSource.create({
                        type: 'feed',
                        name: 'Feed der Fakultät für Physik und Astronomie',
                        url: 'http://www.physik.uni-heidelberg.de/aktuelles/rss/rss.xml',
                        category: category
                    }, function (err, source) {
                        if (err || source === null) {
                            throw err;
                        }
                    });
                });

                NewsCategory.create({
                    title: 'Kirchhoff Institut für Physik',
                    imagePath: 'something',
                    parent: category
                }, function (err, category) {
                    if (err || category === null) {
                        throw err;
                    }
                    NewsSource.create({
                        type: 'feed',
                        name: 'Feed des Kirchhoff Instituts für Physik',
                        url: 'http://www.kip.uni-heidelberg.de/rss/rss.xml',
                        category: category
                    }, function (err, source) {
                        if (err || source === null) {
                            throw err;
                        }
                    });
                });

                NewsCategory.create({
                    title: 'Kolloquien',
                    imagePath: 'something',
                    parent: category
                }, function (err, category) {
                    if (err || category === null) {
                        throw err;
                    }
                });
            });
        });

        Canteen.count(function (err, count) {
            if (err || count !== 0) {
                return;
            }

            Canteen.create({
                'title': 'Zentralmensa',
                'parseTitle': 'Mensa Im Neuenheimer Feld 304',
                'location': {
                    'lat': 49.41561,
                    'lng': 8.67072
                },
                'parsable': true
            }, function (err, canteen) {
                if (err)
                    throw err;

                CanteenSection.create({
                    'title': 'A+B',
                    'canteen': canteen
                });
                CanteenSection.create({
                    'title': 'D',
                    'canteen': canteen
                });
                CanteenSection.create({
                    'title': 'E',
                    'canteen': canteen
                });
            });
            Canteen.create({
                'title': 'zeughaus',
                'parseTitle': 'zeughaus-Mensa im Marstall',
                'location': {
                    'lat': 49.41299,
                    'lng': 8.70476
                },
                'parsable': true
            }, function (err, canteen) {
                if (err)
                    throw err;

                CanteenSection.create({
                    'title': 'Buffet',
                    'canteen': canteen
                });
            });
            Canteen.create({
                'title': 'Triplex-Mensa',
                'parseTitle': 'Triplex-Mensa am Uniplatz',
                'location': {
                    'lat': 49.41068,
                    'lng': 8.70576
                },
                'parsable': true
            }, function (err, canteen) {
                if (err)
                    throw err;

                CanteenSection.create({
                    'title': 'A',
                    'canteen': canteen
                });
                CanteenSection.create({
                    'title': 'B',
                    'canteen': canteen
                });
                CanteenSection.create({
                    'title': 'C',
                    'canteen': canteen
                });
            });
        });

        User.count(function (err, count) {
            if (err || count !== 0) {
                return;
            }

            User.create(
                {
                    username: 'admin',
                    email: 'admin@c9n.de',
                    password: 'test'
                },
                function (err, user) {
                    if (err) return cb(err);

                    //create the admin role
                    Role.create({
                        name: 'admin'
                    }, function (err, role) {
                        if (err) {
                            throw err;
                        }

                        //make bob an admin
                        role.principals.create({
                            principalType: RoleMapping.USER,
                            principalId: user.id
                        }, function (err, principal) {
                            if (err) {
                                throw err;
                            }
                            console.log(principal);
                        });
                    });
                }
            );
        });
    };


    db.isActual(function (err, actual) {
        if (!actual) {
            console.log('Database needs update, automigrating table structure from model...');
            db.autoupdate(function () {
                generateSampleData();
            });
        } else {
            generateSampleData();
        }
    });
};
