import { inject, injectable } from 'inversify';

import { Client } from '~/apps/client/domain/client';
import { ClientDBRepository } from '~/apps/client/domain/client-db-repository';
import { TYPES } from '~/apps/core/container/injection-types';

@injectable()
export class GetClients {
  constructor(@inject(TYPES.ClientDBRepository) private readonly clientDBRepository: ClientDBRepository) {}

  async execute(page?: number): Promise<{ clients: Client[]; count: number }> {
    return this.clientDBRepository.findMany(page);
  }
}
