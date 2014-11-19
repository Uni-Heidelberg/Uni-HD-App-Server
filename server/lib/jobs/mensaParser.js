/**
 *
 * @type {exports}
 */

var app = require('../../server.js');

var jsdom = require('jsdom');
var jQuery = require('jquery');
var async = require('async');

// Importieren der Module in den lokalen Namensraum
var Mensa = app.models.Mensa;
var MensaDailyMenu = app.models.MensaDailyMenu;
var MensaMeal = app.models.MensaMeal;
var MensaSection = app.models.MensaSection;


module.exports = function (agenda) {
    agenda.define(
        'parse mensa content',
        function (job, done) {
            console.log('Starting parsing data for mensas...');

            // Suche alle Mensen
            Mensa.find(function (err, mensas) {
                if (err) {
                    return;
                }

                // Rufe die Webseite des Studentenwerks auf und wandle es in ein DOM-Object um
                jsdom.env(
                    'http://www.studentenwerk.uni-heidelberg.de/speiseplan',
                    function (error, window) {
                        // Mache aus einfach DOM jQuery
                        var $ = jQuery(window);

                        // Laufe über jede mensa
                        async.each(
                            mensas,
                            function (mensa, callback) {
                                if (!mensa.parsable) {
                                    return;
                                }
                                console.log('Parsing now data for ' + mensa.title);

                                // Traversierung durch den HTML-Baum der Webseite
                                // 1. Finde das Element, welches den Mensa Namen enthält
                                $('h3.mensa-title:contains("' + mensa.title + '")')
                                    // gehe zum Elternknoten
                                    .parent()
                                    // und finde das Kind mit den Tabellen und Überschriften
                                    // der einzelnen Tage
                                    .children('div.collapse-content')
                                    .children('h4 + table')
                                    // iteriere wiederum über jede Tabelle
                                    .each(
                                    function () {
                                        // this referenziert das DOM-Object, wir möchten aber jQuery Komfort
                                        var el = $(this);

                                        // Parsen des Datums (Dienstag, 18.11.2014) zu 2014-11-18
                                        var rawDate =
                                            el
                                                .prev()
                                                .text()
                                                .match(
                                                /.*, ([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{1,4})/
                                            );
                                        var date = new Date(rawDate[3], rawDate[2] - 1, rawDate[1], 12, 0, 0);

                                        // Iteriere über jede Tabellen Zeile
                                        el.find('tr').each(function () {
                                            var el = $(this);

                                            // Überspringe Header
                                            if (el.hasClass('mensa-header')) {
                                                return;
                                            }

                                            var mealData = {};
                                            // iteriere über die Tabellenzellen
                                            el.children('td').each(function (i) {
                                                var el = $(this);

                                                switch (i) {
                                                    case 0:
                                                        mealData.title = el.text().trim().replace(/\n/g, '');
                                                        break;
                                                    case 1:
                                                        mealData.sectionTitle = el.text().trim();
                                                        break;
                                                    case 2:
                                                        mealData.priceStud = el.text().trim();
                                                        break;
                                                    case 3:
                                                        mealData.priceBed = el.text().trim();
                                                        break;
                                                    case 4:
                                                        mealData.priceGuest = el.text().trim();
                                                        break;
                                                    default:
                                                        callback('to mouch tds :O');
                                                }
                                            });

                                            MensaSection.findOne(
                                                {
                                                    'where': {
                                                        'mensaId': mensa.id,
                                                        'title': mealData.sectionTitle
                                                    }
                                                },
                                                function (err, section) {
                                                    if (err) {
                                                        console.log('Error finding section');
                                                        console.log(err);
                                                        return;
                                                    }

                                                    var dailyMenuData = {
                                                        'date': date,
                                                        'sectionId': section.id
                                                    };
                                                    MensaDailyMenu.findOrCreate(
                                                        {'where': dailyMenuData},
                                                        dailyMenuData,
                                                        function (err, menu) {
                                                            if (err) {
                                                                console.log('Error finding or creating daily menu');
                                                                console.log(err);
                                                                return;
                                                            }
                                                            delete mealData.sectionTitle;

                                                            // Something like this necessary
                                                            // if mensa is changing something  already published
                                                            /*menu.meals.destroyAll(function (err) {
                                                             if (err) {
                                                             console.log('Error removing all meals from menu');
                                                             console.log(err);
                                                             }
                                                             });*/

                                                            MensaMeal.findOrCreate(
                                                                {'where': mealData},
                                                                mealData,
                                                                function (err, meal) {
                                                                    if (err) {
                                                                        console.log('Error finding or creating meal');
                                                                        console.log(err);
                                                                        return;
                                                                    }
                                                                    menu.meals.add(meal, function (err) {
                                                                        if (err) {
                                                                            console.log('Error adding meal to menu');
                                                                            console.log(err);
                                                                            return;
                                                                        }
                                                                    });
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        });
                                    }
                                );
                                callback();
                            },
                            function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                    }
                );

            });

            done();
        }
    );
};
