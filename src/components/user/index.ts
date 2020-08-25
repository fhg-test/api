import { Router } from 'express';
import proxy from 'express-http-proxy';

import { RESOURCE } from './constants';

import config from '../../config';
import { RouteOptions } from '..';
import { authenticate } from '../sessions/middleware';
import users from '../users';
import sessions from '../sessions';
import rbac from '../rbac';

const path = `/${RESOURCE}`;
const serviceEndpoint = `http://${config.host}:${config.port}`;

const routes = (_: RouteOptions): Router => {
  const router = Router();

  router.route('/').get(
    authenticate,
    proxy(serviceEndpoint, {
      proxyReqPathResolver(req) {
        return `/api${users.path}/${(req.user as string) ?? ''}`;
      },
    }),
  );

  router.route(sessions.path).post(
    proxy(serviceEndpoint, {
      proxyReqPathResolver() {
        return `/api${sessions.path}`;
      },
    }),
  );

  router.route(`${sessions.path}/current`).all(
    authenticate,
    proxy(serviceEndpoint, {
      proxyReqPathResolver(req) {
        return `/api${sessions.path}/${(req.sessionID as string) ?? ''}`;
      },
    }),
  );

  router.route(rbac.path).get(
    authenticate,
    proxy(serviceEndpoint, {
      proxyReqPathResolver(req) {
        return `/api${rbac.path}/${(req.user as string) ?? ''}`;
      },
    }),
  );

  return router;
};

export default { path, routes };
