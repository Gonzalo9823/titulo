import { injectable } from 'inversify';

import { Client } from '~/apps/client/domain/client';
import { ClientDBRepository, CreateClientDto } from '~/apps/client/domain/client-db-repository';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';

import { pool } from '~/infrastructures/pg';
import { ClientModel } from '~/infrastructures/pg/entities/client';
import { ErrorHandler } from '~/infrastructures/pg/error-handler';
import { ClientTransformer } from '~/infrastructures/pg/transformers/client';

@injectable()
export class ClientPGRepository implements ClientDBRepository {
  async create(clientData: CreateClientDto): Promise<Client> {
    const newClient = await this.addDataToClient(clientData);

    return ClientTransformer.toDomain(newClient);
  }

  async findMany(page?: number): Promise<{ clients: Client[]; count: number }> {
    const { clients, count } = await this.getClients(page);

    return {
      clients: clients.map((client) => ClientTransformer.toDomain(client)),
      count,
    };
  }

  async findById(id: UUID): Promise<Client> {
    const client = await this.getClient(id);

    return ClientTransformer.toDomain(client);
  }

  // Private Methods
  private async addDataToClient(clientData: CreateClientDto): Promise<ClientModel> {
    try {
      const { name, lastName, email } = clientData;

      const res = await pool.query<ClientModel>(`INSERT INTO "clients" (name, last_name, email) VALUES ($1, $2, $3) RETURNING *`, [
        name,
        lastName,
        email,
      ]);

      return res.rows[0];
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async getClients(page?: number): Promise<{ clients: ClientModel[]; count: number }> {
    const count = await pool.query<{ count: number }>(`SELECT COUNT(*) FROM "clients"`);

    let clientsQuery = `SELECT * FROM "clients"`;
    const clientsQueryValues = [];

    if (page) {
      clientsQuery += ` LIMIT 10 OFFSET $1`;
      clientsQueryValues.push((page - 1) * 10);
    }

    const clients = await pool.query<ClientModel>(clientsQuery, clientsQueryValues);

    return {
      clients: clients.rows,
      count: count.rows[0].count,
    };
  }

  private async getClient(id: UUID): Promise<ClientModel> {
    const client = (await pool.query<ClientModel>(`SELECT * FROM "clients" WHERE id = $1`, [id])).rows[0];

    if (!client) throw new CustomError(ErrorType.Validation, ErrorCode.DataNotFound, [{ path: 'client', type: ContextErrorType.NotFound }]);

    return client;
  }
}
