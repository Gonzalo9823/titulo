import { Harvest } from '~/apps/harvest/domain/harvest';

import { HarvestModel } from '~/infrastructures/type-orm/entities/harvest';
import { ClientTransformer } from '~/infrastructures/type-orm/transformers/client';
import { CommodityTransformer } from '~/infrastructures/type-orm/transformers/commodity';
import { GrowerTransformer } from '~/infrastructures/type-orm/transformers/grower';
import { GrowerFarmTransformer } from '~/infrastructures/type-orm/transformers/grower-farm';
import { VarietyTransformer } from '~/infrastructures/type-orm/transformers/variety';

export class HarvestTransformer {
  static toDomain(harvest: HarvestModel): Harvest {
    const { id, grower, farm, client, commodity, variety, createdAt } = harvest;

    const { farms, ..._grower } = GrowerTransformer.toDomain(grower);
    const { varieties, ..._commodity } = CommodityTransformer.toDomain(commodity);

    return {
      id,
      grower: _grower,
      farm: GrowerFarmTransformer.toDomain(farm),
      client: ClientTransformer.toDomain(client),
      commodity: _commodity,
      variety: VarietyTransformer.toDomain(variety),
      createdAt,
    };
  }

  static toInfrastructure(harvest: Harvest): HarvestModel {
    const { id, grower, farm, client, commodity, variety, createdAt } = harvest;

    const harvestModel = new HarvestModel();

    harvestModel.id = id;
    harvestModel.grower = GrowerTransformer.toInfrastructure(grower);
    harvestModel.farm = GrowerFarmTransformer.toInfrastructure(farm);
    harvestModel.client = ClientTransformer.toInfrastructure(client);
    harvestModel.commodity = CommodityTransformer.toInfrastructure(commodity);
    harvestModel.variety = VarietyTransformer.toInfrastructure(variety);
    harvestModel.createdAt = createdAt;

    return harvestModel;
  }
}
