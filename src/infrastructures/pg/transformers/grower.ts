import { Grower } from '~/apps/grower/domain/grower';

import { GrowerModel } from '~/infrastructures/pg/entities/grower';
import { GrowerFarmTransformer } from '~/infrastructures/pg/transformers/grower-farm';

export class GrowerTransformer {
  static toDomain(grower: GrowerModel): Grower;
  static toDomain(grower: Omit<GrowerModel, 'farms'>): Omit<Grower, 'farms'>;
  static toDomain(grower: GrowerModel | PartialBy<GrowerModel, 'farms'>): Grower | Omit<Grower, 'farms'> {
    const { id, name, last_name, email, farms } = grower;

    const _farms = farms ? farms.map((farm) => GrowerFarmTransformer.toDomain(farm)) : undefined;

    return {
      id,
      name,
      lastName: last_name,
      email,
      ...(_farms ? { farms: _farms } : {}),
    };
  }
}
