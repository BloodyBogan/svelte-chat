const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      async (username, password, done) => {
        try {
          const user = await User.findOne({
            username,
          });
          if (!user) {
            return done(null, false, {
              message: 'Invalid credentials',
            });
          }

          const isPasswordValid = await User.isPasswordValid(password);
          if (!isPasswordValid) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, user);
        } catch (err) {
          return done(null, false, { message: 'There was an error' });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
