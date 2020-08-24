import { Group } from '@fhg-test/core';

import Model, { Document } from './model';

class Repository {
  /**
   * Create
   */

  public static async create(object: Group): Promise<Group> {
    const document = new Model(object);
    await document.save();

    return transform(document);
  }

  /**
   * Bulk actions
   */
  public static async initData(objects: Group[]): Promise<Group[]> {
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

const transform = (document: Document): Group => {
  const { _id, ...restDocument } = document.toJSON();

  return { ...restDocument, id: _id };
};

export default Repository;
