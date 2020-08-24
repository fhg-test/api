import { Router } from 'express';

import { RESOURCE } from './constants';

import { RouteOptions } from '..';
import { authenticate } from '../sessions/middleware';
import users from '../users';
import sessions from '../sessions';
import rbac from '../rbac';

const path = `/${RESOURCE}`;

const routes = (_: RouteOptions): Router => {
  const router = Router();

  router.route('/').get(authenticate, (req, res) => {
    res.redirect(307, `/api${users.path}/${(req.user as string) ?? ''}`);
  });

  router.route(sessions.path).all((_, res) => {
    res.redirect(307, `/api${sessions.path}`);
  });

  router.route(`${sessions.path}/current`).all(authenticate, (req, res) => {
    res.redirect(307, `/api${sessions.path}/${req.sessionID ?? ''}`);
  });

  router.route(rbac.path).get(authenticate, (req, res) => {
    res.redirect(307, `/api${rbac.path}/${(req.user as string) ?? ''}`);
  });

  return router;
};

export default { path, routes };
