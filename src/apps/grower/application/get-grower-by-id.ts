import { inject, injectable } from 'inversify';

import { TYPES } from '~/apps/core/container/injection-types';
import { UUID } from '~/apps/core/domain/uuid';
import { Grower } from '~/apps/grower/domain/grower';
import { GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';

@injectable()
export class GetGrowerById {
  constructor(@inject(TYPES.GrowerDBRepository) private readonly growerDBRepository: GrowerDBRepository) {}

  async execute(id: UUID): Promise<Grower> {
    return this.growerDBRepository.findById(id);
  }
}
