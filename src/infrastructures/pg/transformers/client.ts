import { Client } from '~/apps/client/domain/client';

import { ClientModel } from '~/infrastructures/pg/entities/client';

export class ClientTransformer {
  static toDomain(client: ClientModel): Client {
    const { id, name, last_name, email } = client;

    return {
      id,
      name,
      lastName: last_name,
      email,
    };
  }
}
