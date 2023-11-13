import { inject, injectable } from 'inversify';

import { Client } from '~/apps/client/domain/client';
import { ClientDBRepository } from '~/apps/client/domain/client-db-repository';
import { TYPES } from '~/apps/core/container/injection-types';
import { UUID } from '~/apps/core/domain/uuid';

@injectable()
export class GetClientById {
  constructor(@inject(TYPES.ClientDBRepository) private readonly clientDBRepository: ClientDBRepository) {}

  async execute(id: UUID): Promise<Client> {
    return this.clientDBRepository.findById(id);
  }
}
