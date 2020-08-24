import { Passport } from 'passport';
import { User } from '@fhg-test/core';

import localStrategy from './strategies/local';

const passport = new Passport();
passport.use(localStrategy);

passport.serializeUser((user: User, done: Function) => {
  done(null, user.id);
});

passport.deserializeUser((userId: string, done) => {
  try {
    done(null, userId);
  } catch (err) {
    done(err, false);
  }
});

export default passport;
