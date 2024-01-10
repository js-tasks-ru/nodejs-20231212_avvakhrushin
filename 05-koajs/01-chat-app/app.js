const path = require('path');
const Koa = require('koa');
const app = new Koa();
const publisherMiddleware = require('./publisher.middlware');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());
app.use(publisherMiddleware);

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
    const publishedMessage = await ctx.publisher;

    ctx.body = publishedMessage;
});

router.post('/publish', async (ctx, next) => {
    try {
        const message = ctx.request.body.message;

        if (message?.length) {
            ctx.publish(message)
            ctx.body = null;
        }
    } catch (error) {
        ctx.throw(500, 'Internal Server Error');
    }
});

app.use(router.routes());

module.exports = app;
