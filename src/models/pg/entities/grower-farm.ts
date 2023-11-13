import { CustomBaseModel } from '~/models/pg/entities/custom-base';
import { GrowerModel } from '~/models/pg/entities/grower';

export interface GrowerFarmModel extends CustomBaseModel {
  grower: Omit<GrowerModel, 'farms'>;
  name: string;
  address: string;
}
