module.exports = function (ImageBase) {

    ImageBase.afterInitialize = function () {
        if (!this.imageError && !this.imageLastCheck) {
            this.save();
        }
    };

    ImageBase.beforeSave = function (next, modelInstance) {
        if (modelInstance.imageContainer && modelInstance.imageName) {
            ImageBase.app.models.Storage.getFile(
                modelInstance.imageContainer,
                modelInstance.imageName,
                function (err, file) {
                    if (err) {
                        modelInstance.imageUrl = null;
                        modelInstance.imageError = err.toString();
                    } else {
                        modelInstance.imageUrl =
                            'http://appserver.physik.uni-heidelberg.de/static/storage/' +
                            modelInstance.imageContainer + '/' + modelInstance.imageName;

                        modelInstance.imageModified = file.mtime;
                        modelInstance.imageError = null;

                        modelInstance.imageLastCheck = new Date();
                    }

                    next();
                }
            );
        } else {
            modelInstance.imageUrl = null;
            modelInstance.imageModified = null;
            modelInstance.imageLastCheck = new Date();
            modelInstance.imageError = null;

            next();
        }
    };

};
