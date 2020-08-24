import { Router } from 'express';

import { RESOURCE } from './constants';

import { RouteOptions } from '..';
import { authenticate } from '../sessions/middleware';
import sessions from '../sessions';
import users from '../users';

const path = `/${RESOURCE}`;

const routes = (_: RouteOptions): Router => {
  const router = Router();

  router.route('/').get(authenticate, (req, res) => {
    res.redirect(307, `${users.path}/${(req.user as string) ?? ''}`);
  });

  router.route(sessions.path).all((_, res) => {
    res.redirect(307, sessions.path);
  });

  router.route(`${sessions.path}/current`).all(authenticate, (req, res) => {
    res.redirect(307, `${sessions.path}/${req.sessionID ?? ''}`);
  });

  return router;
};

export default { path, routes };
