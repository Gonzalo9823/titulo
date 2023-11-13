import { Grower } from '~/apps/grower/domain/grower';

import { GrowerModel } from '~/infrastructures/type-orm/entities/grower';
import { GrowerFarmTransformer } from '~/infrastructures/type-orm/transformers/grower-farm';

export class GrowerTransformer {
  static toDomain(grower: PartialBy<GrowerModel, 'farms'>): Grower {
    const { id, name, lastName, email, farms } = grower;

    return {
      id,
      name,
      lastName,
      email,
      farms: farms?.map((farm) => GrowerFarmTransformer.toDomain(farm)) || [],
    };
  }

  static toInfrastructure(grower: PartialBy<Grower, 'farms'>): GrowerModel {
    const { id, name, lastName, email, farms } = grower;

    const growerModel = new GrowerModel();

    growerModel.id = id;
    growerModel.name = name;
    growerModel.lastName = lastName;
    growerModel.email = email;
    growerModel.farms = farms?.map((farm) => GrowerFarmTransformer.toInfrastructure(farm)) || [];

    return growerModel;
  }
}
