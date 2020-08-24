import { Router } from 'express';

import { RESOURCE } from './constants';
import { validateCreateBody } from './middleware';
import { create, getById, get, del } from './controller';

import { RouteOptions } from '..';
import { authenticate } from '../sessions/middleware';
import passport from './passport';

const path = `/${RESOURCE}`;

const routes = (_: RouteOptions): Router => {
  const router = Router();

  router.param('id', getById);

  router.route('/').post(authenticate, validateCreateBody, create(passport));

  router.route('/:id').get(authenticate, get).delete(authenticate, del);

  return router;
};

export default { path, routes };
