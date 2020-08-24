import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { HttpError } from '@boringcodes/utils/error';

import Repository from './repository';

const list = async (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const objects = await Repository.list();

    res.send(objects);
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

export { list };
