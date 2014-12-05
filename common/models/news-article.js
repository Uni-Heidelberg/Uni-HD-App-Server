module.exports = function (NewsArticle) {
    NewsArticle.afterInitialize = function () {
        this.imageUrl = '';
    };

    NewsArticle.beforeSave = function (next, modelInstance) {
        delete modelInstance.imageUrl;

        next();
    };
};
