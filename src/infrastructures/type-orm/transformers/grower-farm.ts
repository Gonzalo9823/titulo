import { GrowerFarm } from '~/apps/grower/domain/grower-farm';

import { GrowerFarmModel } from '~/infrastructures/type-orm/entities/grower-farm';

export class GrowerFarmTransformer {
  static toDomain(growerFarm: GrowerFarmModel): GrowerFarm {
    const { id, name, address } = growerFarm;

    return {
      id,
      name,
      address,
    };
  }

  static toInfrastructure(growerFarm: GrowerFarm): GrowerFarmModel {
    const { id, name, address } = growerFarm;

    const growerFarmModel = new GrowerFarmModel();

    growerFarmModel.id = id;
    growerFarmModel.name = name;
    growerFarmModel.address = address;

    return growerFarmModel;
  }
}
