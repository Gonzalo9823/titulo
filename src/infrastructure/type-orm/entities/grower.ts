import { Entity, OneToMany } from 'typeorm';

import { BasePersonModel } from '~/infrastructure/type-orm/entities/base-person';
import { GrowerFarmModel } from '~/infrastructure/type-orm/entities/grower-farm';
import { HarvestModel } from '~/infrastructure/type-orm/entities/harvest';

@Entity({ name: 'growers' })
export class GrowerModel extends BasePersonModel {
  @OneToMany(() => GrowerFarmModel, (growerFarm) => growerFarm.grower)
  farms!: GrowerFarmModel[];

  @OneToMany(() => HarvestModel, (harvest) => harvest.grower)
  harvests!: HarvestModel[];
}
