import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ClientModel } from '~/infrastructure/type-orm/entities/client';
import { CommodityModel } from '~/infrastructure/type-orm/entities/commodity';
import { CustomBaseModel } from '~/infrastructure/type-orm/entities/custom-base';
import { GrowerModel } from '~/infrastructure/type-orm/entities/grower';
import { GrowerFarmModel } from '~/infrastructure/type-orm/entities/grower-farm';
import { VarietyModel } from '~/infrastructure/type-orm/entities/variety';

@Entity({ name: 'harvests' })
export class HarvestModel extends CustomBaseModel {
  @ManyToOne(() => GrowerModel, (grower) => grower.harvests, { nullable: false })
  @JoinColumn({ name: 'grower_id' })
  grower!: GrowerModel;

  @ManyToOne(() => GrowerFarmModel, (farm) => farm.harvests, { nullable: false })
  @JoinColumn({ name: 'grower_farm_id' })
  farm!: GrowerFarmModel;

  @ManyToOne(() => ClientModel, (client) => client.harvests, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client!: ClientModel;

  @ManyToOne(() => CommodityModel, (commodity) => commodity.harvests, { nullable: false })
  @JoinColumn({ name: 'commodity_id' })
  commodity!: CommodityModel;

  @ManyToOne(() => VarietyModel, (variety) => variety.harvests, { nullable: false })
  @JoinColumn({ name: 'variety_id' })
  variety!: VarietyModel;
}
