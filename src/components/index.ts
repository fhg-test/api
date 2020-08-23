import { Router } from 'express';

// TODO: import components for registering to router
// import things from './components/things';

interface RouteOptions {
  readonly dev: boolean;
}

// eslint-disable-next-line
const routes = (options: RouteOptions) => {
  const router = Router();

  // TODO: register components to router
  // router.use(things.path, things.routes(options));

  return router;
};

export default routes;
export { RouteOptions };
