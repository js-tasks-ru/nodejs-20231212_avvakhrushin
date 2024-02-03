const LocalStrategy = require('passport-local').Strategy;
const User = require('./../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email });
      const passwordMatched = await user?.checkPassword?.(password);

      switch (true) {
        case !user:
          return done(null, false, 'Нет такого пользователя');
        case !passwordMatched:
          return done(null, false, 'Неверный пароль');
        default:
          return done(null, user);
      }
    } catch (err) {
      done(err);
    }
  },
);
