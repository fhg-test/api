import mongoose, {
  Schema,
  Document as MongooseDocument,
  Model as MongooseModel,
} from 'mongoose';
import { RBAC } from '@fhg-test/core';

import { ENTITY } from './constants';
import { ENTITY as PERMISSION_ENTITY } from '../permissions/constants';

type Methods = {
  readonly authorize: (permission: string) => boolean;
};
type Document = MongooseDocument & RBAC & Methods;
type Model = MongooseModel<Document>;

const schema = new Schema({
  permissions: [
    {
      type: String,
      ref: PERMISSION_ENTITY,
      required: true,
    },
  ],
});

Object.assign(schema.methods, {
  authorize(permission: string): boolean {
    return (this as Document).permissions.includes(permission);
  },
});

export default mongoose.model<Document, Model>(ENTITY, schema);
export { Model, Document };
