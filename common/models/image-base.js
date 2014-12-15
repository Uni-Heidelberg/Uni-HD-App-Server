module.exports = function (ImageBase) {
    var createImageObject = function (modelInstance) {
        if (modelInstance.imageContainer && modelInstance.imageName) {
            modelInstance.image = {};

            if (modelInstance.imageError) {
                modelInstance.image.error = modelInstance.imageError;
            } else if (!modelInstance.imageModified) {
                modelInstance.save();
                modelInstance.image = null;
            } else {
                modelInstance.image.url =
                    ImageBase.app.get('restApiRoot') +
                    '/storage/' + modelInstance.imageContainer +
                    '/download/' + modelInstance.imageName;
                modelInstance.image.modified = modelInstance.imageModified;
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
            ImageBase.app.models.Storage.getFile(
                modelInstance.imageContainer,
                modelInstance.imageName,
                function (err, file) {
                    if (err) {
                        modelInstance.imageError = err.toString();
                    } else {
                        modelInstance.imageModified = file.mtime;
                        modelInstance.imageError = null;
                        modelInstance.imageLastCheck = new Date();
                    }

                    next();
                }
            );
        } else {
            modelInstance.imageModified = null;
            modelInstance.imageError = null;
            modelInstance.imageLastCheck = null;

            next();
        }
    };

};
