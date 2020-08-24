import mongoose, {
  Schema,
  Document as MongooseDocument,
  Model as MongooseModel,
} from 'mongoose';
import { Group } from '@fhg-test/core';

import { ENTITY } from './constants';
import { ENTITY as PERMISSION_ENTITY } from '../permissions/constants';

type Document = MongooseDocument & Group;
type Model = MongooseModel<Document>;

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  permissions: [
    {
      type: String,
      ref: PERMISSION_ENTITY,
      required: true,
    },
  ],
});

export default mongoose.model<Document, Model>(ENTITY, schema);
export { Model, Document };
