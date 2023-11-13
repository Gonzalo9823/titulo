import { Column, Entity, OneToMany } from 'typeorm';

import { CustomBaseModel } from '~/models/type-orm/entities/custom-base';
import { HarvestModel } from '~/models/type-orm/entities/harvest';
import { VarietyModel } from '~/models/type-orm/entities/variety';

@Entity({ name: 'commodities' })
export class CommodityModel extends CustomBaseModel {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => VarietyModel, (variety) => variety.commodity)
  varieties!: VarietyModel[];

  @OneToMany(() => HarvestModel, (harvest) => harvest.commodity)
  harvests!: HarvestModel[];
}
