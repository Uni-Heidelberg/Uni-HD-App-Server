'use strict';

var async = require('async');

module.exports = function (agenda, app) {
    agenda.define(
        'job scheduler',
        function (job, done) {
            app.models.Job.find(function (err, jobs) {
                if (err) {
                    done(err);
                } else if (jobs) {
                    async.each(
                        jobs,
                        function (job, callback) {
                            if (job.name === 'delete' && job.interval === 'delete') {
                                if (!(job.data && job.data instanceof Object)) {
                                    return callback('delete job, but no query specified');
                                }
                                agenda.cancel(
                                    job.data,
                                    function (err, numRemoved) {
                                        console.log('deleted jobs from db query:', job.data);
                                        console.log('deleted jobs from db:', numRemoved);
                                        callback(err);
                                    }
                                );
                                job.destroy(function () {
                                });
                            } else if (job.interval === 'now') {
                                agenda.now(job.name, job.data);
                                job.destroy(function (err) {
                                    callback(err);
                                });
                            } else {
                                agenda.every(job.interval, job.name, job.data);
                                job.destroy(function (err) {
                                    callback(err);
                                });
                            }
                        },
                        done
                    );
                } else {
                    done();
                }
            });
        }
    );
};
