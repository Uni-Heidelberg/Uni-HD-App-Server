'use strict';

module.exports = function (agenda, app) {
    agenda.define(
        'image info updater',
        function (job, done) {
            var imageModels = job.attrs.data;

            if(!Array.isArray(imageModels)) {
                done('supplied data is not an array');
                return;
            }

            var errs = {};
            imageModels.forEach(function (imageModel) {
                app.models[imageModel].find(function (err, instances) {
                    if (err) {
                        errs[imageModel] = err;
                    } else {
                        instances.forEach(function (instance) {
                            instance.save();
                        });
                    }

                    imageModels.splice(imageModels.indexOf(imageModel), 1);
                    if (imageModels.length === 0) {
                        done(Object.keys(errs).length > 0 ? JSON.stringify(errs) : null);
                    }
                });
            });
        }
    );
};
