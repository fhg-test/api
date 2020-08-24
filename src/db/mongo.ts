import mongoose from 'mongoose';
import { MyError } from '@boringcodes/utils/error';
import errorHandler from '@boringcodes/utils/errorHandler';
import logger from '@boringcodes/utils/logger';

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST ?? 'localhost';
const port = process.env.MONGO_PORT ? +process.env.MONGO_PORT : 27017;
const dbName = process.env.MONGO_DB_NAME ?? 'fhg-test';
const uri =
  user && password
    ? `${user}:${password}@mongodb://${host}:${port}/${dbName}`
    : `mongodb://${host}:${port}/${dbName}`;

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
