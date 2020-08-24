import { Router } from 'express';

import sessions from './sessions';
import users from './users';
import user from './user';

interface RouteOptions {
  readonly dev: boolean;
}

const routes = (options: RouteOptions): Router => {
  const router = Router();

  router.use(sessions.path, sessions.routes(options));
  router.use(users.path, users.routes(options));
  router.use(user.path, user.routes(options));

  return router;
};

export default routes;
export { RouteOptions };
