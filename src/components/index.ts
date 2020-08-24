import { Router } from 'express';

import bookingStatuses from './booking-statuses';
import bookingTypes from './booking-types';
import bookings from './bookings';
import rbac from './rbac';
import sessions from './sessions';
import user from './user';
import users from './users';

interface RouteOptions {
  readonly dev: boolean;
}

const routes = (options: RouteOptions): Router => {
  const router = Router();

  router.use(bookingStatuses.path, bookingStatuses.routes(options));
  router.use(bookingTypes.path, bookingTypes.routes(options));
  router.use(bookings.path, bookings.routes(options));
  router.use(rbac.path, rbac.routes(options));
  router.use(sessions.path, sessions.routes(options));
  router.use(user.path, user.routes(options));
  router.use(users.path, users.routes(options));

  return router;
};

export default routes;
export { RouteOptions };
