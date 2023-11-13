import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';

import { CustomBaseModel } from '~/models/type-orm/entities/custom-base';
import { GrowerModel } from '~/models/type-orm/entities/grower';
import { HarvestModel } from '~/models/type-orm/entities/harvest';

@Entity({ name: 'grower_farms' })
@Unique('GROWER_FARM_NAME_ADDRESS', ['name', 'address'])
export class GrowerFarmModel extends CustomBaseModel {
  @ManyToOne(() => GrowerModel, (grower) => grower.farms, { nullable: false })
  @JoinColumn({ name: 'grower_id' })
  grower!: GrowerModel;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @OneToMany(() => HarvestModel, (harvest) => harvest.farm)
  harvests!: HarvestModel[];
}
