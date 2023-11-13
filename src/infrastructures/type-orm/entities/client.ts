import { Entity, OneToMany } from 'typeorm';

import { BasePersonModel } from '~/infrastructures/type-orm/entities/base-person';
import { HarvestModel } from '~/infrastructures/type-orm/entities/harvest';

@Entity({ name: 'clients' })
export class ClientModel extends BasePersonModel {
  @OneToMany(() => HarvestModel, (harvest) => harvest.client)
  harvests!: HarvestModel[];
}
