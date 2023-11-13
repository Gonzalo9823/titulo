import { Harvest } from '~/apps/harvest/domain/harvest';

import { HarvestModel } from '~/infrastructures/pg/entities/harvest';
import { ClientTransformer } from '~/infrastructures/pg/transformers/client';
import { CommodityTransformer } from '~/infrastructures/pg/transformers/commodity';
import { GrowerTransformer } from '~/infrastructures/pg/transformers/grower';
import { GrowerFarmTransformer } from '~/infrastructures/pg/transformers/grower-farm';
import { VarietyTransformer } from '~/infrastructures/pg/transformers/variety';

export class HarvestTransformer {
  static toDomain(harvest: HarvestModel): Harvest {
    const { id, grower, farm, client, commodity, variety, created_at } = harvest;

    return {
      id,
      grower: GrowerTransformer.toDomain(grower),
      farm: GrowerFarmTransformer.toDomain(farm),
      client: ClientTransformer.toDomain(client),
      commodity: CommodityTransformer.toDomain(commodity),
      variety: VarietyTransformer.toDomain(variety),
      createdAt: created_at,
    };
  }
}
