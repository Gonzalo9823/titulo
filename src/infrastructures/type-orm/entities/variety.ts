import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';

import { CommodityModel } from '~/infrastructures/type-orm/entities/commodity';
import { CustomBaseModel } from '~/infrastructures/type-orm/entities/custom-base';
import { HarvestModel } from '~/infrastructures/type-orm/entities/harvest';

@Entity({ name: 'varieties' })
@Unique('VARIETY_NAME_COMMODITY', ['name', 'commodity'])
export class VarietyModel extends CustomBaseModel {
  @Column()
  name!: string;

  @ManyToOne(() => CommodityModel, (commodity) => commodity.varieties, { nullable: false })
  @JoinColumn({ name: 'commodity_id' })
  commodity!: CommodityModel;

  @OneToMany(() => HarvestModel, (harvest) => harvest.variety)
  harvests!: HarvestModel[];
}
