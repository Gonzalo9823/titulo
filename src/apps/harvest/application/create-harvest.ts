import { inject, injectable } from 'inversify';

import { GetClientById } from '~/apps/client/application/get-client-by-id';
import { GetCommodityById } from '~/apps/commodity/application/get-commmodity-by-id';
import { TYPES } from '~/apps/core/container/injection-types';
import { findOrThrow } from '~/apps/core/util/find-or-throw';
import { GetGrowerById } from '~/apps/grower/application/get-grower-by-id';
import { Harvest } from '~/apps/harvest/domain/harvest';
import { CreateHarvestDto, HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';

@injectable()
export class CreateHarvest {
  constructor(
    @inject(TYPES.HarvestDBRepository) private readonly harvestDBRepository: HarvestDBRepository,
    @inject(TYPES.GetGrowerById) private readonly getGrowerById: GetGrowerById,
    @inject(TYPES.GetClientById) private readonly getClientById: GetClientById,
    @inject(TYPES.GetCommodityById) private readonly getCommodityById: GetCommodityById
  ) {}

  async execute(
    harvestData: Omit<CreateHarvestDto, 'grower' | 'farm' | 'client' | 'commodity' | 'variety'> & {
      growerId: string;
      farmId: string;
      clientId: string;
      commodityId: string;
      varietyId: string;
    }
  ): Promise<Harvest> {
    const { growerId, farmId, clientId, commodityId, varietyId } = harvestData;

    const grower = await this.getGrowerById.execute(growerId);
    const farm = findOrThrow(grower.farms, ({ id }) => id === farmId, 'CreateHarvest/Farm');
    const client = await this.getClientById.execute(clientId);
    const commodity = await this.getCommodityById.execute(commodityId);
    const variety = findOrThrow(commodity.varieties, ({ id }) => id === varietyId, 'CreateHarvest/Variety');

    return this.harvestDBRepository.create({ grower, farm, client, commodity, variety });
  }
}
