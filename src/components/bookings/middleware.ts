import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import * as yup from 'yup';
import { Booking } from '@fhg-test/core';
import { HttpError } from '@boringcodes/utils/error';

import { ENTITY } from './constants';
import BookingTypesRepository from '../booking-types/repository';

type MyRequest = Request & {
  readonly [ENTITY]: Booking;
};

const createBodySchema = {
  type: yup.string().required(),
  location: yup.string().required(),
  dates: yup.array(yup.date()).required().min(3).max(3),
};
const validateCreate = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const myBody = yup
      .object(createBodySchema)
      .noUnknown()
      .validateSync(req.body);

    // check if type exists
    const isExisted = await BookingTypesRepository.isExisted(req.body.type);
    if (!isExisted) {
      throw new HttpError(BAD_REQUEST, 'Type is not existed');
    }

    Object.assign(req, { myBody });

    next();
  } catch (err) {
    next(new HttpError(err.code || BAD_REQUEST, err));
  }
};

const updateBodySchema = {
  type: yup.string(),
  location: yup.string(),
  dates: yup.array(yup.date()).min(3).max(3),
};
const validateUpdate = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // validate request body
    const myBody = yup
      .object(updateBodySchema)
      .noUnknown()
      .validateSync(req.body);

    // check if type exists
    if (req.body.type) {
      const isExisted = await BookingTypesRepository.isExisted(req.body.type);
      if (!isExisted) {
        throw new HttpError(BAD_REQUEST, 'Type not existed');
      }
    }

    Object.assign(req, { myBody });

    next();
  } catch (err) {
    next(new HttpError(err.code || BAD_REQUEST, err));
  }
};

const approveBodySchema = {
  approvedDate: yup.number().required().min(0).max(2),
};
const validateApprove = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  try {
    // check if status is pending-review
    if ((req as MyRequest)[ENTITY].status !== 'pending-review') {
      throw new HttpError(
        BAD_REQUEST,
        'Status should be pending-review to be approved',
      );
    }

    // validate request body
    const myBody = yup
      .object(approveBodySchema)
      .noUnknown()
      .validateSync(req.body);

    Object.assign(req, { myBody });

    next();
  } catch (err) {
    next(new HttpError(err.code || BAD_REQUEST, err));
  }
};

const validateReject = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  try {
    // check if status is pending-review
    if ((req as MyRequest)[ENTITY].status !== 'pending-review') {
      throw new HttpError(
        BAD_REQUEST,
        'Status should be pending-review to be rejected',
      );
    }

    next();
  } catch (err) {
    next(new HttpError(err.code || BAD_REQUEST, err));
  }
};

export { validateCreate, validateUpdate, validateApprove, validateReject };
