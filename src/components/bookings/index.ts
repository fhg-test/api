import { Router } from 'express';
import { Entity, Action } from '@fhg-test/core';

import { RESOURCE } from './constants';
import {
  list,
  create,
  getById,
  get,
  update,
  approve,
  reject,
} from './controller';

import { RouteOptions } from '..';
import { authenticate } from '../sessions/middleware';
import { authorize } from '../rbac/middleware';
import {
  validateCreate,
  validateUpdate,
  validateApprove,
  validateReject,
} from './middleware';

const path = `/${RESOURCE}`;

const routes = (_: RouteOptions): Router => {
  const router = Router();

  router.param('id', getById);

  router
    .route('/')
    .get(authenticate, list)
    .post(authenticate, validateCreate, create);

  router
    .route('/:id')
    .get(authenticate, get)
    .patch(authenticate, validateUpdate, update);

  router
    .route('/:id/approval')
    .patch(
      authenticate,
      authorize(Entity.Booking, Action.Update),
      validateApprove,
      approve,
    );

  router
    .route('/:id/rejection')
    .patch(
      authenticate,
      authorize(Entity.Booking, Action.Update),
      validateReject,
      reject,
    );

  return router;
};

export default { path, routes };
