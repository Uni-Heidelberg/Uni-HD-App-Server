module.exports = function (ImageBase) {
    ImageBase.afterInitialize = function () {
        if (!this.imagePath || this.imagePath === null) {
            this.imageUrl = null;
        } else {
            this.imageUrl = 'test';
        }
    };

    ImageBase.beforeSave = function (next, modelInstance) {
        delete modelInstance.imageUrl;

        next();
    };

    ImageBase.afterSave = function (next) {
        next();
    }

};
