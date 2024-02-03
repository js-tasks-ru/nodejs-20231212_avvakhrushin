const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return done(null, user);
    }

    const newUser = await User.create({ email, displayName });

    done(null, newUser);
  } catch (err) {
    done(err);
  }
};
