import { Router } from 'express';

import { RESOURCE } from './constants';
import { list } from './controller';

import { RouteOptions } from '..';
import { authenticate } from '../sessions/middleware';

const path = `/${RESOURCE}`;

const routes = (_: RouteOptions): Router => {
  const router = Router();

  router.route('/').get(authenticate, list);

  return router;
};

export default { path, routes };
