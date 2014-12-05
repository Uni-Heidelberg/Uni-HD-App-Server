module.exports = function (NewsEvent) {
    function changeToSpeakerObject(model) {
        model.speaker = {
            name: model.speakerName,
            affiliation: model.speakerAffiliation,
            email: model.speakerEmail,
            url: model.speakerUrl
        };

        delete model.__data.speakerName;
        delete model.__data.speakerAffiliation;
        delete model.__data.speakerEmail;
        delete model.__data.speakerUrl;
    }

    NewsEvent.afterRemote('**', function (ctx, models, next) {
        if(ctx.req.query.speaker && ctx.req.query.speaker == "object") {
            if (models instanceof NewsEvent) {
                changeToSpeakerObject(models);
            }
            if (models instanceof Array) {
                for (var i = 0; i < models.length; i++) {
                    changeToSpeakerObject(models[i]);
                }
            }
        }
        next();
    });
};
