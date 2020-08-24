import mongoose, {
  Schema,
  Document as MongooseDocument,
  Model as MongooseModel,
} from 'mongoose';
import { Booking } from '@fhg-test/core';

import { ENTITY } from './constants';
import { ENTITY as BOOKING_TYPE_ENTITY } from '../booking-types/constants';
import { ENTITY as BOOKING_STATUS_ENTITY } from '../booking-statuses/constants';
import { ENTITY as USER_ENTITY } from '../users/constants';

type Document = MongooseDocument & Booking;
type Model = MongooseModel<Document>;

const schema = new Schema({
  type: {
    type: String,
    ref: BOOKING_TYPE_ENTITY,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  dates: [
    {
      type: Date,
      required: true,
    },
  ],
  approvedDate: Date,
  status: {
    type: String,
    ref: BOOKING_STATUS_ENTITY,
    default: 'pending-review',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: USER_ENTITY,
    required: true,
  },
});

export default mongoose.model<Document, Model>(ENTITY, schema);
export { Model, Document };
