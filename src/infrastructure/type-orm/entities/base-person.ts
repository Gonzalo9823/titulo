import { Column } from 'typeorm';

import { CustomBaseModel } from '~/infrastructure/type-orm/entities/custom-base';

export abstract class BasePersonModel extends CustomBaseModel {
  @Column()
  name!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ unique: true })
  email!: string;
}
