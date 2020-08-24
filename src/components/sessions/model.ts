import mongoose, {
  Schema,
  Document as MongooseDocument,
  Model as MongooseModel,
} from 'mongoose';
import { Session } from '@fhg-test/core';

import { ENTITY } from './constants';

type Document = MongooseDocument & Session;
type Model = MongooseModel<Document>;

const schema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  session: String,
  expires: Date,
});

export default mongoose.model<Document, Model>(ENTITY, schema);
export { Model, Document };
