import mongoose, {
  Schema,
  Document as MongooseDocument,
  Model as MongooseModel,
} from 'mongoose';
import crypto from 'crypto';
import { User } from '@fhg-test/core';

import { ENTITY } from './constants';
import { ENTITY as GROUP_ENTITY } from '../groups/constants';

type Methods = {
  readonly hashPassword: (password: string) => string;
  readonly authenticate: (password: string) => boolean;
};
type Document = MongooseDocument & User & Methods;
type Model = MongooseModel<Document>;

const schema = new Schema({
  displayName: String,
  credentials: {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: GROUP_ENTITY,
      required: true,
    },
  ],
});

Object.assign(schema.methods, {
  hashPassword(password: string): string {
    if ((this as Document).credentials.salt && password) {
      return crypto
        .pbkdf2Sync(
          Buffer.from(password, 'binary'),
          Buffer.from((this as Document).credentials.salt, 'binary'),
          10000,
          64,
          'sha1',
        )
        .toString('base64');
    }

    return password;
  },
  authenticate(password: string): boolean {
    return (
      (this as Document).credentials.password === this.hashPassword(password)
    );
  },
});

export default mongoose.model<Document, Model>(ENTITY, schema);
export { Model, Document };
