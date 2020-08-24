import mongoose, {
  Schema,
  Document as MongooseDocument,
  Model as MongooseModel,
} from 'mongoose';
import { BookingStatus } from '@fhg-test/core';

import { ENTITY } from './constants';

type Document = MongooseDocument & BookingStatus;
type Model = MongooseModel<Document>;

const schema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

export default mongoose.model<Document, Model>(ENTITY, schema);
export { Model, Document };
