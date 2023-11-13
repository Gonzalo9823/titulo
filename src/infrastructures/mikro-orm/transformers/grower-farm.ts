import { GrowerFarm } from '~/apps/grower/domain/grower-farm';

import { GrowerFarmModel } from '~/infrastructures/mikro-orm/entities/grower-farm';

export class GrowerFarmTransformer {
  static toDomain(growerFarm: GrowerFarmModel): GrowerFarm {
    const { id, name, address } = growerFarm;

    return {
      id,
      name,
      address,
    };
  }
}
