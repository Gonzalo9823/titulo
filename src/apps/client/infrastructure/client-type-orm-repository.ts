import { injectable } from 'inversify';

import { Client } from '~/apps/client/domain/client';
import { ClientDBRepository, CreateClientDto } from '~/apps/client/domain/client-db-repository';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';

import { AppDataSource } from '~/infrastructures/type-orm';
import { ClientModel } from '~/infrastructures/type-orm/entities/client';
import { ErrorHandler } from '~/infrastructures/type-orm/error-handler';
import { ClientTransformer } from '~/infrastructures/type-orm/transformers/client';

@injectable()
export class ClientTypeORMRepository implements ClientDBRepository {
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
  async addDataToClient(client: ClientModel, clientData: CreateClientDto): Promise<void> {
    try {
      const { name, lastName, email } = clientData;

      client.name = name;
      client.lastName = lastName;
      client.email = email;

      await AppDataSource.getRepository(ClientModel).save(client);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  async getClients(page?: number): Promise<{ clients: ClientModel[]; count: number }> {
    const [clients, count] = await AppDataSource.getRepository(ClientModel).findAndCount({
      order: {
        createdAt: 'DESC',
      },
      take: page ? 10 : undefined,
      skip: page ? (page - 1) * 10 : undefined,
    });

    return { clients, count };
  }

  async getClient(id: UUID): Promise<ClientModel> {
    const client = await AppDataSource.getRepository(ClientModel).findOne({
      where: {
        id,
      },
    });

    if (!client) throw new CustomError(ErrorType.Validation, ErrorCode.DataNotFound, [{ path: 'client', type: ContextErrorType.NotFound }]);

    return client;
  }
}
