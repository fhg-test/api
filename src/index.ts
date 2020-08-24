import { MyError } from '@boringcodes/utils/error';
import errorHandler from '@boringcodes/utils/errorHandler';
import logger from '@boringcodes/utils/logger';

import config from './config';
import mongo from './db/mongo';
import initData from './initData';
import app from './app';

// connect mongo
mongo.connect(initData);

// start app
app.listen(config.port, config.host, (err: Error) => {
  if (err) {
    throw err;
  }

  logger.info(`> App started at http://${config.host}:${config.port}`);
});

// handle unhandled promise
process.on('unhandledRejection', (err: Error) => {
  throw err;
});

// handle uncaught error and gracefully shutdown
process.on('uncaughtException', (err: Error) => {
  errorHandler.handle(new MyError(err));
});
