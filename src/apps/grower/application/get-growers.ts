import { inject, injectable } from 'inversify';

import { TYPES } from '~/apps/core/container/injection-types';
import { Grower } from '~/apps/grower/domain/grower';
import { GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';

@injectable()
export class GetGrowers {
  constructor(@inject(TYPES.GrowerDBRepository) private readonly growerDBRepository: GrowerDBRepository) {}

  async execute(page?: number): Promise<{ growers: Grower[]; count: number }> {
    return this.growerDBRepository.findMany(page);
  }
}
