import { Container } from 'inversify';

import { CreateClient } from '~/apps/client/application/create-client';
import { GetClientById } from '~/apps/client/application/get-client-by-id';
import { GetClients } from '~/apps/client/application/get-clients';
import { ClientDBRepository } from '~/apps/client/domain/client-db-repository';
import { ClientTypeORMRepository } from '~/apps/client/infrastructure/client-type-orm-repository';
import { CreateCommodity } from '~/apps/commodity/application/create-commodity';
import { GetCommodityById } from '~/apps/commodity/application/get-commmodity-by-id';
import { GetCommodites } from '~/apps/commodity/application/get-commodities';
import { CommodityDBRepository } from '~/apps/commodity/domain/commodity-db-repository';
import { CommodityTypeORMRepository } from '~/apps/commodity/infrastructure/commodity-type-orm-repository';
import { TYPES } from '~/apps/core/container/injection-types';
import { CreateGrower } from '~/apps/grower/application/create-grower';
import { GetGrowerById } from '~/apps/grower/application/get-grower-by-id';
import { GetGrowers } from '~/apps/grower/application/get-growers';
import { GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';
import { GrowerTypeORMRepository } from '~/apps/grower/infrastructure/grower-type-orm-repository';
import { CreateHarvest } from '~/apps/harvest/application/create-harvest';
import { GetHarvestById } from '~/apps/harvest/application/get-harvest-by-id';
import { GetHarvests } from '~/apps/harvest/application/get-harvests';
import { HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';
import { HarvestTypeORMRepository } from '~/apps/harvest/infrastructure/harvest-type-orm-repository';

const container = new Container({});

// Client
container.bind<CreateClient>(TYPES.CreateClient).to(CreateClient);
container.bind<GetClients>(TYPES.GetClients).to(GetClients);
container.bind<GetClientById>(TYPES.GetClientById).to(GetClientById);
container.bind<ClientDBRepository>(TYPES.ClientDBRepository).to(ClientTypeORMRepository);

// Commodity
container.bind<CreateCommodity>(TYPES.CreateCommodity).to(CreateCommodity);
container.bind<GetCommodites>(TYPES.GetCommodities).to(GetCommodites);
container.bind<GetCommodityById>(TYPES.GetCommodityById).to(GetCommodityById);
container.bind<CommodityDBRepository>(TYPES.CommodityDBRepository).to(CommodityTypeORMRepository);

// Grower
container.bind<CreateGrower>(TYPES.CreateGrower).to(CreateGrower);
container.bind<GetGrowers>(TYPES.GetGrowers).to(GetGrowers);
container.bind<GetGrowerById>(TYPES.GetGrowerById).to(GetGrowerById);
container.bind<GrowerDBRepository>(TYPES.GrowerDBRepository).to(GrowerTypeORMRepository);

// Harvest
container.bind<CreateHarvest>(TYPES.CreateHarvest).to(CreateHarvest);
container.bind<GetHarvests>(TYPES.GetHarvests).to(GetHarvests);
container.bind<GetHarvestById>(TYPES.GetHarvestById).to(GetHarvestById);
container.bind<HarvestDBRepository>(TYPES.HarvestDBRepository).to(HarvestTypeORMRepository);

export { container };
