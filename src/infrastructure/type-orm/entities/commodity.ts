import { Column, Entity, OneToMany } from 'typeorm';

import { CustomBaseModel } from '~/infrastructure/type-orm/entities/custom-base';
import { VarietyModel } from '~/infrastructure/type-orm/entities/variety';
import { HarvestModel } from '~/infrastructure/type-orm/entities/harvest';

@Entity({ name: 'commodities' })
export class CommodityModel extends CustomBaseModel {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => VarietyModel, (variety) => variety.commodity)
  varieties!: VarietyModel[];

  @OneToMany(() => HarvestModel, (harvest) => harvest.commodity)
  harvests!: HarvestModel[];
}
