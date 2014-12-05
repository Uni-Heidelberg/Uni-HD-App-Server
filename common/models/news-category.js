var app = require('../../server/server');

module.exports = function (NewsCategory) {
    NewsCategory.prototype.getArticles = function (cb) {
        app.models.NewsSource.find(
            {
                'fields': ['id'],
                'where': {
                    'categoryId': this.id
                }
            }, function (err, sources) {
                var sourceIds = [];
                for (var i = 0; i < sources.length; i++) {
                    sourceIds.push(sources[i].id);
                }
                app.models.NewsArticle.find(
                    {
                        'where': {
                            'sourceId': {
                                'inq': sourceIds
                            }
                        }
                    }, function (err, items) {
                        cb(null, items);
                    }
                );
            }
        );
    };

    NewsCategory.remoteMethod(
        'getArticles',
        {
            returns: {arg: 'items', type: 'array', root: true},
            isStatic: false,
            http: {
                verb: 'get',
                path: '/articles'
            }
        }
    );


    NewsCategory.prototype.getEvents = function (cb) {
        app.models.NewsSource.find(
            {
                'fields': ['id'],
                'where': {
                    'categoryId': this.id
                }
            }, function (err, sources) {
                var sourceIds = [];
                for (var i = 0; i < sources.length; i++) {
                    sourceIds.push(sources[i].id);
                }
                app.models.NewsEvent.find(
                    {
                        'where': {
                            'sourceId': {
                                'inq': sourceIds
                            }
                        }
                    }, function (err, items) {
                        cb(null, items);
                    }
                );
            }
        );
    };

    NewsCategory.remoteMethod(
        'getEvents',
        {
            isStatic: false,
            returns: {arg: 'events', type: 'array', root: true},
            http: {
                verb: 'get',
                path: '/events'
            }
        }
    );
};
