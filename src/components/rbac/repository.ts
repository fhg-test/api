import { RBAC } from '@fhg-test/core';

import Model, { Document } from './model';

class Repository {
  /**
   * Create
   */

  public static async create(object: RBAC): Promise<RBAC> {
    const document = new Model(object);
    await document.save();

    return transform(document);
  }

  /**
   * Read
   */

  public static async get(id: string): Promise<RBAC | null> {
    const document = await Model.findById(id).exec();
    if (!document) {
      return null;
    }

    return transform(document);
  }

  public static async authorize(
    id: string,
    permission: string,
  ): Promise<boolean> {
    const document = await Model.findById(id).exec();
    if (!document || !document.authorize(permission)) {
      return false;
    }

    return true;
  }

  /**
   * Bulk actions
   */

  public static async initData(objects: RBAC[]): Promise<RBAC[]> {
    // clear all data before creating new one
    await Model.deleteMany({}).exec();

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

const transform = (document: Document): RBAC => {
  const { _id, ...restDocument } = document.toJSON();

  return { ...restDocument, id: _id };
};

export default Repository;
