import { Client } from '~/apps/client/domain/client';
import { UUID } from '~/apps/core/domain/uuid';

export interface CreateClientDto {
  name: string;
  lastName: string;
  email: string;
}

export interface ClientDBRepository {
  create(clientData: CreateClientDto): Promise<Client>;
  findMany(page?: number): Promise<{ clients: Client[]; count: number }>;
  findById(id: UUID): Promise<Client>;
}
