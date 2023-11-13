import { Collection, Entity, OneToMany } from '@mikro-orm/core';

import { BasePersonModel } from '~/models/mikro-orm/entities/base-person';
import { GrowerFarmModel } from '~/models/mikro-orm/entities/grower-farm';
import { HarvestModel } from '~/models/mikro-orm/entities/harvest';

@Entity({ tableName: 'growers' })
export class GrowerModel extends BasePersonModel {
  @OneToMany(() => GrowerFarmModel, (growerFarm) => growerFarm.grower)
  farms = new Collection<GrowerFarmModel>(this);

  @OneToMany(() => HarvestModel, (harvest) => harvest.grower)
  harvests = new Collection<HarvestModel>(this);
}
