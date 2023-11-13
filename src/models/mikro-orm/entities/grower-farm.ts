import { Collection, Entity, ManyToOne, OneToMany, Property, Ref, Unique } from '@mikro-orm/core';

import { CustomBaseModel } from '~/models/mikro-orm/entities/custom-base';
import { GrowerModel } from '~/models/mikro-orm/entities/grower';
import { HarvestModel } from '~/models/mikro-orm/entities/harvest';

@Entity({ tableName: 'grower_farms' })
@Unique({ properties: ['name', 'address'] })
export class GrowerFarmModel extends CustomBaseModel {
  @ManyToOne(() => GrowerModel, { ref: true, joinColumn: 'grower_id' })
  grower!: Ref<GrowerModel>;

  @Property()
  name!: string;

  @Property()
  address!: string;

  @OneToMany(() => HarvestModel, (harvest) => harvest.farm)
  harvests = new Collection<HarvestModel>(this);
}
