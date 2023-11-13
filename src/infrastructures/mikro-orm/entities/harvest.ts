import { Entity, ManyToOne, Ref } from '@mikro-orm/core';

import { ClientModel } from '~/infrastructures/mikro-orm/entities/client';
import { CommodityModel } from '~/infrastructures/mikro-orm/entities/commodity';
import { CustomBaseModel } from '~/infrastructures/mikro-orm/entities/custom-base';
import { GrowerModel } from '~/infrastructures/mikro-orm/entities/grower';
import { GrowerFarmModel } from '~/infrastructures/mikro-orm/entities/grower-farm';
import { VarietyModel } from '~/infrastructures/mikro-orm/entities/variety';

@Entity({ tableName: 'harvests' })
export class HarvestModel extends CustomBaseModel {
  @ManyToOne(() => GrowerModel, { ref: true, joinColumn: 'grower_id' })
  grower!: Ref<GrowerModel>;

  @ManyToOne(() => GrowerFarmModel, { ref: true, joinColumn: 'grower_farm_id' })
  farm!: Ref<GrowerFarmModel>;

  @ManyToOne(() => ClientModel, { ref: true, joinColumn: 'client_id' })
  client!: Ref<ClientModel>;

  @ManyToOne(() => CommodityModel, { ref: true, joinColumn: 'commodity_id' })
  commodity!: Ref<CommodityModel>;

  @ManyToOne(() => VarietyModel, { ref: true, joinColumn: 'variety_id' })
  variety!: Ref<VarietyModel>;
}
