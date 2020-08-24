import { Booking } from '@fhg-test/core';

import Model, { Document } from './model';

class Repository {
  /**
   * Create
   */

  public static async create(object: Booking): Promise<Booking> {
    const document = new Model(object);
    await document.save();

    return transform(document);
  }

  /**
   * Read
   */

  public static async list(): Promise<Booking[]> {
    const documents = await Model.find();

    return documents.map(transform);
  }

  public static async get(id: string): Promise<Booking | null> {
    const document = await Model.findById(id).exec();
    if (!document) {
      return null;
    }

    return transform(document);
  }

  /**
   * Update
   */

  public static async update({
    id,
    ...restObject
  }: any): Promise<Booking | null> {
    const document = await Model.findById(id).exec();
    if (!document) {
      return null;
    }

    document.set(restObject);
    await document.save();

    return transform(document);
  }

  public static async approve(
    id: string,
    approvedDate: Date,
  ): Promise<Booking | null> {
    const document = await Model.findById(id).exec();
    if (!document) {
      return null;
    }

    document.set({ approvedDate, status: 'approved' });
    await document.save();

    return transform(document);
  }

  public static async reject(id: string): Promise<Booking | null> {
    const document = await Model.findById(id).exec();
    if (!document) {
      return null;
    }

    document.set({ status: 'rejected' });
    await document.save();

    return transform(document);
  }
}

const transform = (document: Document): Booking => {
  const { _id, ...restDocument } = document.toJSON();

  return { ...restDocument, id: _id };
};

export default Repository;
