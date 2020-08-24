import { Request, Response, NextFunction } from 'express';
import {
  UNAUTHORIZED,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from 'http-status-codes';
import * as yup from 'yup';
import { HttpError } from '@boringcodes/utils/error';

const createBodySchema = {
  email: yup.string().required().email().trim().lowercase().max(256),
  password: yup.string().required().min(6).max(256),
};
const validateCreate = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  try {
    yup.object(createBodySchema).noUnknown().validateSync(req.body);

    next();
  } catch (err) {
    next(new HttpError(err.code || BAD_REQUEST, err));
  }
};

const authenticate = (req: Request, __: Response, next: NextFunction): void => {
  try {
    if (!req.isAuthenticated()) {
      throw new HttpError(UNAUTHORIZED, 'Sign in required');
    }

    next();
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

export { validateCreate, authenticate };
