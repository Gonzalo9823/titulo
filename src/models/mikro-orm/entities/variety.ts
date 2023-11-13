import { Collection, Entity, ManyToOne, OneToMany, Property, Ref, Unique } from '@mikro-orm/core';

import { CommodityModel } from '~/models/mikro-orm/entities/commodity';
import { CustomBaseModel } from '~/models/mikro-orm/entities/custom-base';
import { HarvestModel } from '~/models/mikro-orm/entities/harvest';

@Entity({ tableName: 'varieties' })
@Unique({ properties: ['name', 'commodity'] })
export class VarietyModel extends CustomBaseModel {
  @Property()
  name!: string;

  @ManyToOne(() => CommodityModel, { ref: true, joinColumn: 'commodity_id' })
  commodity!: Ref<CommodityModel>;

  @OneToMany(() => HarvestModel, (harvest) => harvest.variety)
  harvests = new Collection<HarvestModel>(this);
}
