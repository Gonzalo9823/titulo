import { Container } from 'inversify';

import { ClientDBRepository } from '~/apps/client/domain/client-db-repository';
import { ClientMikroORMRepository } from '~/apps/client/infrastructure/client-mikro-orm-repository';
import { ClientTypeORMRepository } from '~/apps/client/infrastructure/client-type-orm-repository';
import { CommodityDBRepository } from '~/apps/commodity/domain/commodity-db-repository';
import { CommodityMikroORMRepository } from '~/apps/commodity/infrastructure/commodity-mikro-orm-repository';
import { CommodityTypeORMRepository } from '~/apps/commodity/infrastructure/commodity-type-orm-repository';
import { TYPES } from '~/apps/core/container/injection-types';
import { GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';
import { GrowerMikroORMRepository } from '~/apps/grower/infrastructure/grower-mikro-orm-repository';
import { GrowerTypeORMRepository } from '~/apps/grower/infrastructure/grower-type-orm-repository';
import { HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';
import { HarvestMikroORMRepository } from '~/apps/harvest/infrastructure/harvest-mikro-orm-repository';
import { HarvestTypeORMRepository } from '~/apps/harvest/infrastructure/harvest-type-orm-repository';

import { env } from '~/env';

const repositoriesContainer = new Container({});
const isTypeORM = env.ORM === 'type-orm';

// Client
repositoriesContainer.bind<ClientDBRepository>(TYPES.ClientDBRepository).to(isTypeORM ? ClientTypeORMRepository : ClientMikroORMRepository);

// Commodity
repositoriesContainer
  .bind<CommodityDBRepository>(TYPES.CommodityDBRepository)
  .to(isTypeORM ? CommodityTypeORMRepository : CommodityMikroORMRepository);

// Grower
repositoriesContainer.bind<GrowerDBRepository>(TYPES.GrowerDBRepository).to(isTypeORM ? GrowerTypeORMRepository : GrowerMikroORMRepository);

// Harvest
repositoriesContainer.bind<HarvestDBRepository>(TYPES.HarvestDBRepository).to(isTypeORM ? HarvestTypeORMRepository : HarvestMikroORMRepository);

export { repositoriesContainer };
