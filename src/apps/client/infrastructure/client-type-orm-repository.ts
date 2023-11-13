import { injectable } from 'inversify';

import { ClientDBRepository, CreateClientDto } from '~/apps/client/domain/client-db-repository';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { Person } from '~/apps/core/domain/person';
import { UUID } from '~/apps/core/domain/uuid';
import { AppDataSource } from '~/infrastructure/type-orm';
import { ClientModel } from '~/infrastructure/type-orm/entities/client';
import { ErrorHandler } from '~/infrastructure/type-orm/error-handler';
import { ClientTransformer } from '~/infrastructure/type-orm/transformers/client';

@injectable()
export class ClientTypeORMRepository implements ClientDBRepository {
  async create(clientData: CreateClientDto): Promise<Person> {
    const newClient = new ClientModel();

    await this.addDataToClient(newClient, clientData);

    return ClientTransformer.toDomain(newClient);
  }

  async findMany(page?: number): Promise<{ clients: Person[]; count: number }> {
    const { clients, count } = await this.getClients(page);

    return {
      clients: clients.map((client) => ClientTransformer.toDomain(client)),
      count,
    };
  }

  async findById(id: string): Promise<Person> {
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
