import mongoose from 'mongoose';
import { MyError } from '@boringcodes/utils/error';
import errorHandler from '@boringcodes/utils/errorHandler';
import logger from '@boringcodes/utils/logger';

import mongoConfig from '../config/mongo';

const uri =
  mongoConfig.user && mongoConfig.password
    ? `${mongoConfig.user}:${mongoConfig.password}@mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbName}`
    : `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbName}`;

const connect = (cb = () => {}): void => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    promiseLibrary: Promise,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', () => {
    logger.info('> Mongo connected');

    cb();
  });

  mongoose.connection.on('error', (err: Error) => {
    mongoose.disconnect();

    logger.info('> Mongo failed to connect');
    errorHandler.handle(new MyError(err));
  });
};

export { connect };
export default { connect };
