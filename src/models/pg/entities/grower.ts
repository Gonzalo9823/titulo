import { BasePersonModel } from '~/models/pg/entities/base-person';
import { GrowerFarmModel } from '~/models/pg/entities/grower-farm';

export interface GrowerModel extends BasePersonModel {
  farms: Omit<GrowerFarmModel, 'grower'>[];
}
