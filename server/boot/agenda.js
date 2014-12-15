module.exports = function (app) {
    var Agenda = require('agenda');

    var agenda = new Agenda(
        {
            'db': {
                'address': 'localhost:27017/appserver'
            }
        }
    );

    app.agenda = agenda;

    var jobTypes = [
        'canteenParser',
        'feedParser',
        'hephystoParser',
        'reloadHephystoSources',
        'imageInfoUpdater',
        'jobScheduler'
    ];

    jobTypes.forEach(function (type) {
        require('../lib/jobs/' + type)(agenda);
    });

    agenda.every(app.get('job scheduler interval'), 'job scheduler');

    agenda.on('start', function (job) {
        console.log('Job starting: %s', job.attrs.name);
    });

    agenda.on('success', function (job) {
        console.log('Job success: %s', job.attrs.name);
    });

    agenda.on('fail', function (err, job) {
        console.log('Job failed:', job.attrs.name, err);
    });

    var agendaUI;
    try {
        agendaUI = require('agenda-ui');
        app.use('/agenda-ui', agendaUI(agenda, {poll: 5000}));
    } catch (err) {
        console.log(
            'Run `npm install agenda-ui` to enable agenda-ui'
        );
    }

};
