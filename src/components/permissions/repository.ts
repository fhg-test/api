import { Permission } from '@fhg-test/core';

import Model, { Document } from './model';

class Repository {
  /**
   * Create
   */

  public static async create(object: Permission): Promise<Permission> {
    const document = new Model(object);
    await document.save();

    return transform(document);
  }

  /**
   * Bulk actions
   */
  public static async initData(objects: Permission[]): Promise<Permission[]> {
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

const transform = (document: Document): Permission => {
  const { _id, ...restDocument } = document.toJSON();

  return { ...restDocument, id: _id };
};

export default Repository;
