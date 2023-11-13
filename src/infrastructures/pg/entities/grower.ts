import { BasePersonModel } from '~/infrastructures/pg/entities/base-person';
import { GrowerFarmModel } from '~/infrastructures/pg/entities/grower-farm';

export interface GrowerModel extends BasePersonModel {
  farms: Omit<GrowerFarmModel, 'grower'>[];
}
