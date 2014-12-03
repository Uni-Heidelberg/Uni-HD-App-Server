module.exports = function (app) {

    var db = app.datasources.appserver;

    var NewsCategory = app.models.NewsCategory;
    var NewsSource = app.models.NewsSource;

    var Canteen = app.models.Canteen;
    var CanteenSection = app.models.CanteenSection;

    var generateSampleData = function () {
        NewsCategory.count(function (err, count) {
            if (err || count !== 0) {
                return;
            }

            console.log('No data in database, generating sample data...');
            NewsCategory.create({
                title: 'Universität Heidelberg'
            }, function (err, category) {
                NewsSource.create({
                    title: 'Pressestelle der Universität Heidelberg',
                    url: 'http://www.uni-heidelberg.de/presse/rss.xml',
                    categoryId: category.id
                }, function (err, source) {
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
                });
                NewsSource.create({
                    title: 'Kirchhoff Institut für Physik',
                    url: 'http://www.kip.uni-heidelberg.de/rss/rss.xml',
                    categoryId: category.id
                }, function (err, source) {
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
