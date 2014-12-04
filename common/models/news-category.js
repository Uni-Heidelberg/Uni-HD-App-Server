var app = require('../../server/server');

module.exports = function (NewsCategory) {
    NewsCategory.prototype.getItems = function (cb) {
        app.models.NewsEventSource.find(
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
                app.models.NewsItem.find(
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
        'getItems',
        {
            returns: {arg: 'items', type: 'array', root: true},
            isStatic: false,
            http: {
                verb: 'get',
                path: '/newsItems'
            }
        }
    );


    NewsCategory.prototype.getEvents = function (cb) {
        app.models.NewsEventSource.find(
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
                app.models.EventItem.find(
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
                path: '/eventItems'
            }
        }
    );
};
