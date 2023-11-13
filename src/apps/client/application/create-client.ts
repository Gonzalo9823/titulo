import { inject, injectable } from 'inversify';

import { Client } from '~/apps/client/domain/client';
import { CreateClientDto, ClientDBRepository } from '~/apps/client/domain/client-db-repository';
import { TYPES } from '~/apps/core/container/injection-types';

@injectable()
export class CreateClient {
  constructor(@inject(TYPES.ClientDBRepository) private readonly clientDBRepository: ClientDBRepository) {}

  async execute(clientData: CreateClientDto): Promise<Client> {
    return this.clientDBRepository.create(clientData);
  }
}
