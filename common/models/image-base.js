var app = require('../../server/server');

module.exports = function (ImageBase) {
    var createImageObject = function (modelInstance) {
        if (modelInstance.imageContainer && modelInstance.imageName) {
            modelInstance.image = {};
            if (!modelInstance.imageError) {
                modelInstance.image.url =
                    app.get('restApiRoot') +
                    '/storage/' + modelInstance.imageContainer +
                    '/download/' + modelInstance.imageName;
                modelInstance.image.mtime = modelInstance.imageModified;
            } else {
                modelInstance.image.error = modelInstance.imageError;
            }
        } else {
            modelInstance.image = null;
        }
    };

    ImageBase.afterInitialize = function () {
        createImageObject(this);
    };

    ImageBase.beforeSave = function (next, modelInstance) {
        delete modelInstance.image;

        if (modelInstance.imageContainer && modelInstance.imageName) {
            app.models.Storage.getFile(modelInstance.imageContainer, modelInstance.imageName, function (err, file) {
                if (err) {
                    modelInstance.imageError = err.toString();
                } else {
                    modelInstance.imageModified = file.mtime;
                    modelInstance.imageError = null;
                    modelInstance.imageLastCheck = new Date();
                }

                next();
            });
        } else {
            modelInstance.imageModified = null;
            modelInstance.imageError = null;
            modelInstance.imageLastCheck = null;

            next();
        }
    };

};
