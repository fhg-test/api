import { Request, Response, NextFunction } from 'express';
import {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from 'http-status-codes';
import { Types } from 'mongoose';
import { User } from '@fhg-test/core';
import { HttpError } from '@boringcodes/utils/error';

import Repository from './repository';

const CUSTOM_ENTITY = 'user-info'; // `req.user` is reserved by passportjs
type MyRequest = Request & {
  readonly [CUSTOM_ENTITY]: User;
};

const getById = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.id || !Types.ObjectId.isValid(req.params.id)) {
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

export { getById, get };
