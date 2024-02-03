const Session = require('../models/Session');
const { v4: uuid } = require('uuid');

module.exports = (ctx, next) => {
    ctx.login = async (user) => {
        if (!user?.id) {
            throw new ReferenceError('user is required');
        }

        const token = uuid();

        await Session.findOneAndUpdate(
            { user: user.id },
            { token, user: user.id, lastVisit: new Date() },
            { upsert: true, returnDocument: 'after' }
        );

        return token;
    }

    return next();
}