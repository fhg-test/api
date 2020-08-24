import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Entity, Action } from '@fhg-test/core';
import { HttpError } from '@boringcodes/utils/error';

import Repository from './repository';

const authorize = (entity: Entity, action: Action) => async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const isAuthorized = await Repository.authorize(
      req.user as string,
      `${entity}:${action}`,
    );
    if (!isAuthorized) {
      throw new HttpError(UNAUTHORIZED, 'Request not allowed');
    }

    next();
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

export { authorize };
