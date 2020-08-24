import { Router } from 'express';

import { RESOURCE } from './constants';
import { getById, get } from './controller';

import { RouteOptions } from '..';
import { authenticate } from '../sessions/middleware';

const path = `/${RESOURCE}`;

const routes = (_: RouteOptions): Router => {
  const router = Router();

  router.param('id', getById);

  router.route('/:id').get(authenticate, get);

  return router;
};

export default { path, routes };
