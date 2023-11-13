import { CustomBaseModel } from '~/models/pg/entities/custom-base';

export interface BasePersonModel extends CustomBaseModel {
  name: string;
  last_name: string;
  email: string;
}
