import { Entity, OneToMany } from 'typeorm';

import { BasePersonModel } from '~/models/type-orm/entities/base-person';
import { GrowerFarmModel } from '~/models/type-orm/entities/grower-farm';
import { HarvestModel } from '~/models/type-orm/entities/harvest';

@Entity({ name: 'growers' })
export class GrowerModel extends BasePersonModel {
  @OneToMany(() => GrowerFarmModel, (growerFarm) => growerFarm.grower)
  farms!: GrowerFarmModel[];

  @OneToMany(() => HarvestModel, (harvest) => harvest.grower)
  harvests!: HarvestModel[];
}
