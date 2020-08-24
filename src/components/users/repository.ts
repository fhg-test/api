import { User } from '@fhg-test/core';

import Model, { Document } from './model';

class Repository {
  /**
   * Create
   */

  public static async create(object: User): Promise<User> {
    const document = new Model(object);
    await document.save();

    return transform(document);
  }

  /**
   * Read
   */

  public static async get(id: string): Promise<User | null> {
    const document = await Model.findById(id).exec();
    if (!document) {
      return null;
    }

    return transform(document);
  }

  public static async authenticate(
    email: string,
    password: string,
  ): Promise<User | null> {
    const document = await Model.findOne({
      'credentials.email': new RegExp(`^${email}$`, 'i'),
    }).exec();
    if (!document || !document.authenticate(password)) {
      return null;
    }

    return transform(document);
  }

  /**
   * Bulk actions
   */
  public static async initData(objects: User[]): Promise<User[]> {
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

const transform = (document: Document): User => {
  const { _id, credentials: _, ...restDocument } = document.toJSON();

  return { ...restDocument, id: _id };
};

export default Repository;
