import { Collection, Entity, OneToMany } from '@mikro-orm/core';

import { BasePersonModel } from '~/models/mikro-orm/entities/base-person';
import { HarvestModel } from '~/models/mikro-orm/entities/harvest';

@Entity({ tableName: 'clients' })
export class ClientModel extends BasePersonModel {
  @OneToMany(() => HarvestModel, (harvest) => harvest.client)
  harvests = new Collection<HarvestModel>(this);
}
