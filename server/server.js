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

require('./lib/jobs/news.js')(agenda);
require('./lib/jobs/mensaParser.js')(agenda);

agenda.every(app.get('news interval'), 'reloading news');
agenda.every(app.get('mensa interval'), 'parse mensa content');

agenda.start();

// start the server if `$ node server.js`
if (require.main === module) {
    app.start();
}
