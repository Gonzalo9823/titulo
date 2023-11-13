import { Entity, Property, Unique } from '@mikro-orm/core';

import { CustomBaseModel } from '~/models/mikro-orm/entities/custom-base';

@Entity({ abstract: true })
export abstract class BasePersonModel extends CustomBaseModel {
  @Property()
  name!: string;

  @Property({ fieldName: 'last_name' })
  lastName!: string;

  @Property()
  @Unique()
  email!: string;
}
