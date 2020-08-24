import { Strategy } from 'passport-local';

import UsersRepository from '../../../users/repository';

const authFields = {
  usernameField: 'email',
  passwordField: 'password',
};

const authFunction = async (
  email: string,
  password: string,
  done: Function,
): Promise<void> => {
  try {
    const user = await UsersRepository.authenticate(email, password);
    if (!user) {
      throw new Error('Email or Password incorrect');
    }

    done(null, user);
  } catch (err) {
    done(new Error('Email or Password incorrect'), false);
  }
};

export default new Strategy(
  authFields,
  authFunction, // eslint-disable-line @typescript-eslint/no-misused-promises
);
