import { inject, injectable } from 'inversify';

import { TYPES } from '~/apps/core/container/injection-types';
import { Grower } from '~/apps/grower/domain/grower';
import { CreateGrowerDto, GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';

@injectable()
export class CreateGrower {
  constructor(@inject(TYPES.GrowerDBRepository) private readonly growerDBRepository: GrowerDBRepository) {}

  async execute(growerData: CreateGrowerDto): Promise<Grower> {
    return this.growerDBRepository.create(growerData);
  }
}
