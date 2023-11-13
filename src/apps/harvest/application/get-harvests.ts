import { inject, injectable } from 'inversify';

import { TYPES } from '~/apps/core/container/injection-types';
import { Harvest } from '~/apps/harvest/domain/harvest';
import { HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';

@injectable()
export class GetHarvests {
  constructor(@inject(TYPES.HarvestDBRepository) private readonly harvestDBRepository: HarvestDBRepository) {}

  async execute(page?: number): Promise<{ harvests: Harvest[]; count: number }> {
    return this.harvestDBRepository.findMany(page);
  }
}
