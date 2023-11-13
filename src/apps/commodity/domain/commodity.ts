import { Variety } from '~/apps/commodity/domain/variety';
import { UUID } from '~/apps/core/domain/uuid';

export interface Commodity {
  id: UUID;
  name: string;
  varieties: Variety[];
}
