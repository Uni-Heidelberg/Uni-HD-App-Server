require("clim")(console, true);

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --

// boot scripts mount components like REST API
boot(app, __dirname);

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
var path = require('path');
app.use(loopback.static(path.resolve(__dirname, '../client')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        console.log('Web server listening at: %s', app.get('url'));
    });
};

var Agenda = require('agenda');

var agenda = new Agenda(
    {
        'db': {
            'address': 'localhost:27017/appserver'
        }
    }
);

jobTypes = [
    'canteenParser',
    'feedParser',
    'hephystoParser',
    'reloadHephystoSources'
];

jobTypes.forEach(function (type) {
    require('./lib/jobs/' + type)(agenda);
});

agenda.every(app.get('feed interval'), 'parse feeds');
agenda.every(app.get('canteen interval'), 'parse canteens');
agenda.every(app.get('hephysto interval'), 'parse hephysto');

app.models.NewsCategory.findOne(
    {
        where: {
            title: 'Kolloquien'
        }
    },
    function (err, category) {
        if (err || category === null) {
            return console.error(err);
        }
        agenda.now('reload hephysto sources', {categoryId: category.id});
    }
);

agenda.start();

agenda.purge(function (err, numRemoved) {
    console.log(numRemoved);
});

function graceful() {
    agenda.stop(function () {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

// start the server if `$ node server.js`
if (require.main === module) {
    app.start();
}

