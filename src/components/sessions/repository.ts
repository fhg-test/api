import { Session } from '@fhg-test/core';

import Model, { Document } from './model';

class Repository {
  /**
   * Read
   */

  public static async get(id: string): Promise<Session | null> {
    const document = await Model.findById(id).exec();
    if (!document) {
      return null;
    }

    return transform(document);
  }
}

const transform = (document: Document): Session => {
  const { _id, ...restDocument } = document.toJSON();
  const { passport } = JSON.parse(restDocument.session);

  return {
    ...restDocument,
    id: _id,
    user: passport?.user,
  };
};

export default Repository;
