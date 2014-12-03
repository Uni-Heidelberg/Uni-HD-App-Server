var app = require('../../server/server');

module.exports = function (NewsCategory) {
    NewsCategory.findItems = function (id, cb) {
        app.models.NewsEventSource.find(
            {
                'fields': ['id'],
                'where': {
                    'categoryId': id
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
        'findItems',
        {
            accepts: {
                arg: 'id',
                type: 'any',
                required: true,
                http: {
                    source: 'path'
                }
            },
            returns: {arg: 'items', type: 'array', root: true},
            http: {
                verb: 'get',
                path: '/:id/items'
            }
        }
    );


    NewsCategory.findEvents = function (id, cb) {
        app.models.NewsEventSource.find(
            {
                'fields': ['id'],
                'where': {
                    'categoryId': id
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
        'findEvents',
        {
            accepts: {
                arg: 'id',
                type: 'any',
                required: true,
                http: {
                    source: 'path'
                }
            },
            returns: {arg: 'events', type: 'array', root: true},
            http: {
                verb: 'get',
                path: '/:id/events'
            }
        }
    );
};
