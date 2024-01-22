const { default: mongoose } = require('mongoose');

module.exports = (params) => {
    const { retrieveId, message, status } = params ? params : {};

    return (ctx, next) => {
        const id = retrieveId ? retrieveId(ctx) : ctx.params.id;

        if (id && !mongoose.isValidObjectId(id)) {
            ctx.throw(status || 400, message || 'Invalid Object ID');
        }

        return next();
    }
}