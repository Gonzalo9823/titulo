import { Client } from '~/apps/client/domain/client';

import { ClientModel } from '~/infrastructures/type-orm/entities/client';

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

  static toInfrastructure(client: Client): ClientModel {
    const { id, name, lastName, email } = client;

    const clientModel = new ClientModel();

    clientModel.id = id;
    clientModel.name = name;
    clientModel.lastName = lastName;
    clientModel.email = email;

    return clientModel;
  }
}
