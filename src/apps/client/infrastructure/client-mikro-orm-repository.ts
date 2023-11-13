import { injectable } from 'inversify';

import { Client } from '~/apps/client/domain/client';
import { ClientDBRepository, CreateClientDto } from '~/apps/client/domain/client-db-repository';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';

import { getEntityManager } from '~/infrastructures/mikro-orm';
import { ClientModel } from '~/infrastructures/mikro-orm/entities/client';
import { ErrorHandler } from '~/infrastructures/mikro-orm/error-handler';
import { ClientTransformer } from '~/infrastructures/mikro-orm/transformers/client';

@injectable()
export class ClientMikroORMRepository implements ClientDBRepository {
  async create(clientData: CreateClientDto): Promise<Client> {
    const newClient = new ClientModel();

    await this.addDataToClient(newClient, clientData);

    return ClientTransformer.toDomain(newClient);
  }

  async findMany(page?: number): Promise<{ clients: Client[]; count: number }> {
    const { clients, count } = await this.getClients(page);

    return {
      clients: clients.map((client) => ClientTransformer.toDomain(client)),
      count,
    };
  }

  async findById(id: string): Promise<Client> {
    const client = await this.getClient(id);

    return ClientTransformer.toDomain(client);
  }

  // Private Methods
  async addDataToClient(client: ClientModel, clientData: CreateClientDto) {
    try {
      const { name, lastName, email } = clientData;

      client.name = name;
      client.lastName = lastName;
      client.email = email;

      await getEntityManager().persistAndFlush(client);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  async getClients(page?: number) {
    const [clients, count] = await getEntityManager().findAndCount(
      ClientModel,
      {},
      {
        orderBy: {
          createdAt: 'DESC',
        },
        limit: page ? 10 : undefined,
        offset: page ? (page - 1) * 10 : undefined,
      }
    );

    return { clients, count };
  }

  async getClient(id: UUID): Promise<ClientModel> {
    const client = await getEntityManager().findOne(ClientModel, {
      id,
    });

    if (!client) throw new CustomError(ErrorType.Validation, ErrorCode.DataNotFound, [{ path: 'client', type: ContextErrorType.NotFound }]);

    return client;
  }
}
