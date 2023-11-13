import { Client } from '~/apps/client/domain/client';
import { Commodity } from '~/apps/commodity/domain/commodity';
import { Variety } from '~/apps/commodity/domain/variety';
import { UUID } from '~/apps/core/domain/uuid';
import { Grower } from '~/apps/grower/domain/grower';
import { GrowerFarm } from '~/apps/grower/domain/grower-farm';
import { Harvest } from '~/apps/harvest/domain/harvest';

export interface CreateHarvestDto {
  grower: Grower;
  farm: GrowerFarm;
  client: Client;
  commodity: Commodity;
  variety: Variety;
}

export interface HarvestDBRepository {
  create(harvestData: CreateHarvestDto): Promise<Harvest>;
  findMany(page?: number): Promise<{ harvests: Harvest[]; count: number }>;
  findById(id: UUID): Promise<Harvest>;
}
