import { Loaded } from '@mikro-orm/core';

import { Harvest } from '~/apps/harvest/domain/harvest';

import { HarvestModel } from '~/infrastructures/mikro-orm/entities/harvest';
import { ClientTransformer } from '~/infrastructures/mikro-orm/transformers/client';
import { CommodityTransformer } from '~/infrastructures/mikro-orm/transformers/commodity';
import { GrowerTransformer } from '~/infrastructures/mikro-orm/transformers/grower';
import { GrowerFarmTransformer } from '~/infrastructures/mikro-orm/transformers/grower-farm';
import { VarietyTransformer } from '~/infrastructures/mikro-orm/transformers/variety';

export class HarvestTransformer {
  static toDomain(harvest: Loaded<HarvestModel, 'grower' | 'farm' | 'client' | 'commodity' | 'variety'>): Harvest {
    const { id, grower, farm, client, commodity, variety, createdAt } = harvest;

    return {
      id,
      grower: GrowerTransformer.toDomain(grower.$),
      farm: GrowerFarmTransformer.toDomain(farm.$),
      client: ClientTransformer.toDomain(client.$),
      commodity: CommodityTransformer.toDomain(commodity.$),
      variety: VarietyTransformer.toDomain(variety.$),
      createdAt,
    };
  }
}
