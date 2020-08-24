import { MyError } from '@boringcodes/utils/error';
import errorHandler from '@boringcodes/utils/errorHandler';
import logger from '@boringcodes/utils/logger';

import mongo from './db/mongo';
import initData from './initData';
import app from './app';

// declare env vars
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? +process.env.PORT : 5000;

// connect mongo
mongo.connect(initData);

// start app
app.listen(port, host, (err: Error) => {
  if (err) {
    throw err;
  }

  logger.info(`> App started at http://${host}:${port}`);
});

// handle unhandled promise
process.on('unhandledRejection', (err: Error) => {
  throw err;
});

// handle uncaught error and gracefully shutdown
process.on('uncaughtException', (err: Error) => {
  errorHandler.handle(new MyError(err));
});
