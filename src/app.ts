import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { isDev } from '@boringcodes/utils';
import {
  health,
  handleNotFound,
  handleErrors,
} from '@boringcodes/utils/express';

import config from './config';
import passport from './components/sessions/passport';
import components from './components';

// initialize app
const app = express();
const dev = isDev();
const MongoStore = connectMongo(session);

// plug middleware
app.use(morgan(dev ? 'dev' : 'common'));
app.use(
  session({
    ...config.session,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(health());

// plug components
app.use(components({ dev }));

// handle errors
app.use(handleNotFound);
app.use(handleErrors);

export default app;
