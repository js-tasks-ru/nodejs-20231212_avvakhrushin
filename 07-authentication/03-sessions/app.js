const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const handleMongooseValidationError = require('./libs/validationErrors');
const mustBeAuthenticated = require('./libs/mustBeAuthenticated');
const { login } = require('./controllers/login');
const { oauth, oauthCallback } = require('./controllers/oauth');
const { me } = require('./controllers/me');
const loginContextExtension = require('./middlewares/login-context-extension');
const commonErrorHandler = require('./middlewares/common-error-handler');
const sessionValidation = require('./middlewares/session-validation');

const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

app.use(commonErrorHandler);

app.use(loginContextExtension);

const router = new Router({ prefix: '/api' });

router.use(sessionValidation);

router.post('/login', login);

router.get('/oauth/:provider', oauth);
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback);

router.get('/me', mustBeAuthenticated, me);

app.use(router.routes());

// this for HTML5 history in browser
const fs = require('fs');

const index = fs.readFileSync(path.join(__dirname, 'public/index.html'));
app.use(async (ctx) => {
  if (ctx.url.startsWith('/api') || ctx.method !== 'GET') return;

  ctx.set('content-type', 'text/html');
  ctx.body = index;
});

module.exports = app;
