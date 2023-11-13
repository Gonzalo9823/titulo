import { CustomBaseModel } from '~/infrastructures/pg/entities/custom-base';
import { GrowerModel } from '~/infrastructures/pg/entities/grower';

export interface GrowerFarmModel extends CustomBaseModel {
  grower: Omit<GrowerModel, 'farms'>;
  name: string;
  address: string;
}
