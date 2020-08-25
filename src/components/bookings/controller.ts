import { Request, Response, NextFunction } from 'express';
import {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from 'http-status-codes';
import { Types } from 'mongoose';
import { Entity, Action, Booking } from '@fhg-test/core';
import { HttpError } from '@boringcodes/utils/error';

import { ENTITY } from './constants';
import Repository from './repository';
import RBACRepository from '../rbac/repository';

type MyRequest = Request & {
  readonly myBody: any;
  readonly [ENTITY]: Booking;
};

const list = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const isAuthorized = await RBACRepository.authorize(
      req.user as string,
      `${Entity.Booking}.${Action.Update}`,
    );
    const objects = isAuthorized
      ? await Repository.list()
      : await Repository.listByCreatedBy(req.user as string);

    res.send(objects);
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const object = await Repository.create({
      ...(req as MyRequest).myBody,
      createdBy: req.user,
    });

    res.send(object);
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
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

    Object.assign(req, { [ENTITY]: object });

    next();
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

const get = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send((req as MyRequest)[ENTITY]);
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const object = await Repository.update({
      ...(req as MyRequest).myBody,
      id: (req as MyRequest)[ENTITY].id,
    });

    res.send(object);
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

const approve = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const object = await Repository.approve(
      (req as MyRequest)[ENTITY].id,
      (req as MyRequest)[ENTITY].dates[(req as MyRequest).myBody.approvedDate],
    );

    res.send(object);
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

const reject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const object = await Repository.reject((req as MyRequest)[ENTITY].id);

    res.send(object);
  } catch (err) {
    next(new HttpError(err.code || INTERNAL_SERVER_ERROR, err));
  }
};

export { list, create, getById, get, update, approve, reject };
