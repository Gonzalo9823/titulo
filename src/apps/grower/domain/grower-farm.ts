import { UUID } from '~/apps/core/domain/uuid';

export interface GrowerFarm {
  id: UUID;
  name: string;
  address: string;
}
