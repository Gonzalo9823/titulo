import { Container } from 'inversify';

import { ClientDBRepository } from '~/apps/client/domain/client-db-repository';
import { CommodityDBRepository } from '~/apps/commodity/domain/commodity-db-repository';
import { TYPES } from '~/apps/core/container/injection-types';
import { GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';
import { HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';

import { env } from '~/env';

const repositoriesContainer = new Container();

(async () => {
  if (env.ORM === 'type-orm') {
    const { ClientTypeORMRepository } = await import('~/apps/client/infrastructure/client-type-orm-repository');
    const { CommodityTypeORMRepository } = await import('~/apps/commodity/infrastructure/commodity-type-orm-repository');
    const { GrowerTypeORMRepository } = await import('~/apps/grower/infrastructure/grower-type-orm-repository');
    const { HarvestTypeORMRepository } = await import('~/apps/harvest/infrastructure/harvest-type-orm-repository');

    repositoriesContainer.bind<ClientDBRepository>(TYPES.ClientDBRepository).to(ClientTypeORMRepository);
    repositoriesContainer.bind<CommodityDBRepository>(TYPES.CommodityDBRepository).to(CommodityTypeORMRepository);
    repositoriesContainer.bind<GrowerDBRepository>(TYPES.GrowerDBRepository).to(GrowerTypeORMRepository);
    repositoriesContainer.bind<HarvestDBRepository>(TYPES.HarvestDBRepository).to(HarvestTypeORMRepository);
  }

  if (env.ORM === 'mikro-orm') {
    const { ClientMikroORMRepository } = await import('~/apps/client/infrastructure/client-mikro-orm-repository');
    const { CommodityMikroORMRepository } = await import('~/apps/commodity/infrastructure/commodity-mikro-orm-repository');
    const { GrowerMikroORMRepository } = await import('~/apps/grower/infrastructure/grower-mikro-orm-repository');
    const { HarvestMikroORMRepository } = await import('~/apps/harvest/infrastructure/harvest-mikro-orm-repository');

    repositoriesContainer.bind<ClientDBRepository>(TYPES.ClientDBRepository).to(ClientMikroORMRepository);
    repositoriesContainer.bind<CommodityDBRepository>(TYPES.CommodityDBRepository).to(CommodityMikroORMRepository);
    repositoriesContainer.bind<GrowerDBRepository>(TYPES.GrowerDBRepository).to(GrowerMikroORMRepository);
    repositoriesContainer.bind<HarvestDBRepository>(TYPES.HarvestDBRepository).to(HarvestMikroORMRepository);
  }

  if (env.ORM === 'pg') {
    const { ClientPGRepository } = await import('~/apps/client/infrastructure/client-pg-repository');
    const { CommodityPGRepository } = await import('~/apps/commodity/infrastructure/commodity-pg-repository');
    const { GrowerPGMRepository } = await import('~/apps/grower/infrastructure/grower-pg-repository');
    const { HarvestPGMRepository } = await import('~/apps/harvest/infrastructure/harvest-pg-repository');

    repositoriesContainer.bind<ClientDBRepository>(TYPES.ClientDBRepository).to(ClientPGRepository);
    repositoriesContainer.bind<CommodityDBRepository>(TYPES.CommodityDBRepository).to(CommodityPGRepository);
    repositoriesContainer.bind<GrowerDBRepository>(TYPES.GrowerDBRepository).to(GrowerPGMRepository);
    repositoriesContainer.bind<HarvestDBRepository>(TYPES.HarvestDBRepository).to(HarvestPGMRepository);
  }
})();

export { repositoriesContainer };
