import { CustomBaseModel } from '~/infrastructures/pg/entities/custom-base';

export interface BasePersonModel extends CustomBaseModel {
  name: string;
  last_name: string;
  email: string;
}
