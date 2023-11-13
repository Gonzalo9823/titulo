import { Person } from '~/apps/core/domain/person';
import { GrowerFarm } from '~/apps/grower/domain/grower-farm';

export interface Grower extends Person {
  farms: GrowerFarm[];
}
