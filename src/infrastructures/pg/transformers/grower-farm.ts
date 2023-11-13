import { GrowerFarm } from '~/apps/grower/domain/grower-farm';

import { GrowerFarmModel } from '~/infrastructures/pg/entities/grower-farm';

export class GrowerFarmTransformer {
  static toDomain(growerFarm: Omit<GrowerFarmModel, 'grower'>): GrowerFarm {
    const { id, name, address } = growerFarm;

    return {
      id,
      name,
      address,
    };
  }
}
