const publisherMiddleware = async (ctx, next) => {
    const rootContext = ctx.app.context;

    if (!rootContext.publisher) {
        rootContext.publisher = new Promise(resolve => (rootContext.publish = (message) => {
            resolve(message);
            rootContext.publisher = null;
            rootContext.publish = null;
        }));
    }

    await next();
}

module.exports = publisherMiddleware;