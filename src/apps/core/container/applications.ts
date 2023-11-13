import { Container } from 'inversify';

import { CreateClient } from '~/apps/client/application/create-client';
import { GetClientById } from '~/apps/client/application/get-client-by-id';
import { GetClients } from '~/apps/client/application/get-clients';
import { CreateCommodity } from '~/apps/commodity/application/create-commodity';
import { GetCommodityById } from '~/apps/commodity/application/get-commmodity-by-id';
import { GetCommodites } from '~/apps/commodity/application/get-commodities';
import { TYPES } from '~/apps/core/container/injection-types';
import { CreateGrower } from '~/apps/grower/application/create-grower';
import { GetGrowerById } from '~/apps/grower/application/get-grower-by-id';
import { GetGrowers } from '~/apps/grower/application/get-growers';
import { CreateHarvest } from '~/apps/harvest/application/create-harvest';
import { GetHarvestById } from '~/apps/harvest/application/get-harvest-by-id';
import { GetHarvests } from '~/apps/harvest/application/get-harvests';

const applicationsContainer = new Container({});

// Client
applicationsContainer.bind<CreateClient>(TYPES.CreateClient).to(CreateClient);
applicationsContainer.bind<GetClients>(TYPES.GetClients).to(GetClients);
applicationsContainer.bind<GetClientById>(TYPES.GetClientById).to(GetClientById);

// Commodity
applicationsContainer.bind<CreateCommodity>(TYPES.CreateCommodity).to(CreateCommodity);
applicationsContainer.bind<GetCommodites>(TYPES.GetCommodities).to(GetCommodites);
applicationsContainer.bind<GetCommodityById>(TYPES.GetCommodityById).to(GetCommodityById);

// Grower
applicationsContainer.bind<CreateGrower>(TYPES.CreateGrower).to(CreateGrower);
applicationsContainer.bind<GetGrowers>(TYPES.GetGrowers).to(GetGrowers);
applicationsContainer.bind<GetGrowerById>(TYPES.GetGrowerById).to(GetGrowerById);

// Harvest
applicationsContainer.bind<CreateHarvest>(TYPES.CreateHarvest).to(CreateHarvest);
applicationsContainer.bind<GetHarvests>(TYPES.GetHarvests).to(GetHarvests);
applicationsContainer.bind<GetHarvestById>(TYPES.GetHarvestById).to(GetHarvestById);

export { applicationsContainer };
