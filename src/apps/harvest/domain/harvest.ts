import { Client } from '~/apps/client/domain/client';
import { Commodity } from '~/apps/commodity/domain/commodity';
import { Variety } from '~/apps/commodity/domain/variety';
import { UUID } from '~/apps/core/domain/uuid';
import { Grower } from '~/apps/grower/domain/grower';
import { GrowerFarm } from '~/apps/grower/domain/grower-farm';

export interface Harvest {
  id: UUID;
  grower: Omit<Grower, 'farms'>;
  farm: GrowerFarm;
  client: Client;
  commodity: Omit<Commodity, 'varieties'>;
  variety: Variety;
  createdAt: Date;
}
