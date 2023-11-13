import { inject, injectable } from 'inversify';

import { TYPES } from '~/apps/core/container/injection-types';
import { UUID } from '~/apps/core/domain/uuid';
import { Harvest } from '~/apps/harvest/domain/harvest';
import { HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';

@injectable()
export class GetHarvestById {
  constructor(@inject(TYPES.HarvestDBRepository) private readonly harvestDBRepository: HarvestDBRepository) {}

  async execute(id: UUID): Promise<Harvest> {
    return this.harvestDBRepository.findById(id);
  }
}
