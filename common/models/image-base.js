module.exports = function (ImageBase) {

    ImageBase.afterInitialize = function () {
        var self = this;
        if (!self.imageLastCheck) {
            self.updateImageInfo(function () {
                self.save();
            });
        }
    };

    ImageBase.prototype.updateImageInfo = function (callback) {
        callback = callback || function(){};

        var self = this;
        if (self.imageContainer && self.imageName) {
            ImageBase.app.models.Storage.getFile(
                self.imageContainer,
                self.imageName,
                function (err, file) {
                    if (err) {
                        self.imageUrl = null;
                        self.imageError = err.toString();
                        self.imageLastCheck = new Date();
                    } else {
                        self.imageUrl =
                            'http://appserver.physik.uni-heidelberg.de/static/storage/' +
                            self.imageContainer + '/' + self.imageName;

                        self.imageModified = file.mtime;
                        self.imageError = null;

                        self.imageLastCheck = new Date();
                    }

                    callback();
                }
            );
        } else {
            self.imageUrl = null;
            self.imageModified = null;
            self.imageLastCheck = new Date();
            self.imageError = null;

            callback();
        }
    };

};
