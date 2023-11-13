import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import { CustomBaseModel } from '~/models/mikro-orm/entities/custom-base';
import { HarvestModel } from '~/models/mikro-orm/entities/harvest';
import { VarietyModel } from '~/models/mikro-orm/entities/variety';

@Entity({ tableName: 'commodities' })
export class CommodityModel extends CustomBaseModel {
  @Property()
  @Unique()
  name!: string;

  @OneToMany(() => VarietyModel, (variety) => variety.commodity)
  varieties = new Collection<VarietyModel>(this);

  @OneToMany(() => HarvestModel, (harvest) => harvest.commodity)
  harvests = new Collection<HarvestModel>(this);
}
