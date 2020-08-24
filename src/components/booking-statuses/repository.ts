import { BookingStatus } from '@fhg-test/core';

import Model, { Document } from './model';

class Repository {
  /**
   * Create
   */

  public static async create(object: BookingStatus): Promise<BookingStatus> {
    const document = new Model(object);
    await document.save();

    return transform(document);
  }

  /**
   * Read
   */

  public static async list(): Promise<BookingStatus[]> {
    const documents = await Model.find().exec();

    return documents.map(transform);
  }

  /**
   * Bulk actions
   */
  public static async initData(
    objects: BookingStatus[],
  ): Promise<BookingStatus[]> {
    return await Promise.all(
      objects.map(async (object) => {
        const document = await Model.findById(object.id).exec();
        if (!document) {
          return await Repository.create(object);
        }

        return transform(document);
      }),
    );
  }
}

const transform = (document: Document): BookingStatus => {
  const { _id, ...restDocument } = document.toJSON();

  return { ...restDocument, id: _id };
};

export default Repository;
