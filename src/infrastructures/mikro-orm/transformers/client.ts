import { Client } from '~/apps/client/domain/client';

import { ClientModel } from '~/infrastructures/mikro-orm/entities/client';

export class ClientTransformer {
  static toDomain(client: ClientModel): Client {
    const { id, name, lastName, email } = client;

    return {
      id,
      name,
      lastName,
      email,
    };
  }
}
