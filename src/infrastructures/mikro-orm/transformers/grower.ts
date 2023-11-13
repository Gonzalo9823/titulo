import { Loaded } from '@mikro-orm/core';

import { Grower } from '~/apps/grower/domain/grower';

import { GrowerModel } from '~/infrastructures/mikro-orm/entities/grower';
import { GrowerFarmTransformer } from '~/infrastructures/mikro-orm/transformers/grower-farm';
import { isCollectionInitialized } from '~/infrastructures/mikro-orm/transformers/util/is-collection-initialized';

export class GrowerTransformer {
  static toDomain(grower: Loaded<GrowerModel, 'farms'>): Grower;
  static toDomain(grower: Loaded<GrowerModel>): Omit<Grower, 'farms'>;
  static toDomain(grower: Loaded<GrowerModel, 'farms'> | Loaded<GrowerModel>): Grower | Omit<Grower, 'farms'> {
    const { id, name, lastName, email, farms } = grower;

    const _farms = isCollectionInitialized(farms) ? farms.$.map((farm) => GrowerFarmTransformer.toDomain(farm)) : undefined;

    return {
      id,
      name,
      lastName,
      email,
      ...(_farms ? { farms: _farms } : {}),
    };
  }
}
