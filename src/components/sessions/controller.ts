import { Request, Response, NextFunction } from 'express';
import {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from 'http-status-codes';
import { Session, User } from '@fhg-test/core';
import { HttpError } from '@boringcodes/utils/error';

import Repository from './repository';

const CUSTOM_ENTITY = 'session-info'; // `req.session` is reserved by passportjs
type MyRequest = Request & {
  readonly [CUSTOM_ENTITY]: Session;
};

const create = (passport: any) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate('local', (err: Error, user: User) => {
    try {
      if (err) {
        throw new HttpError(UNAUTHORIZED, err);
      }

      req.login(user, (err) => {
        if (err) {
          next(new HttpError(UNAUTHORIZED, 'Sign in failed'));
        } else {
          res.send({
            id: req.sessionID,
            user: user.id,
          });
        }
      });
    } catch (err) {
      next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
    }
  })(req, res, next);
};

const getById = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.id) {
      throw new HttpError(BAD_REQUEST, 'Invalid resource Id');
    }

    const object = await Repository.get(req.params.id);
    if (!object) {
      throw new HttpError(NOT_FOUND, 'Resource not found');
    }

    Object.assign(req, { [CUSTOM_ENTITY]: object });

    next();
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

const get = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send((req as MyRequest)[CUSTOM_ENTITY]);
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

const del = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.logout();

    res.send({ id: (req as MyRequest)[CUSTOM_ENTITY].id });
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

export { create, getById, get, del };
