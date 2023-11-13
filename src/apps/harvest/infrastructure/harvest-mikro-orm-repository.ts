import { Loaded } from '@mikro-orm/core';
import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';
import { Harvest } from '~/apps/harvest/domain/harvest';
import { CreateHarvestDto, HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';

import { getEntityManager } from '~/infrastructures/mikro-orm';
import { ClientModel } from '~/infrastructures/mikro-orm/entities/client';
import { CommodityModel } from '~/infrastructures/mikro-orm/entities/commodity';
import { GrowerModel } from '~/infrastructures/mikro-orm/entities/grower';
import { GrowerFarmModel } from '~/infrastructures/mikro-orm/entities/grower-farm';
import { HarvestModel } from '~/infrastructures/mikro-orm/entities/harvest';
import { VarietyModel } from '~/infrastructures/mikro-orm/entities/variety';
import { ErrorHandler } from '~/infrastructures/mikro-orm/error-handler';
import { HarvestTransformer } from '~/infrastructures/mikro-orm/transformers/harvest';

@injectable()
export class HarvestMikroORMRepository implements HarvestDBRepository {
  async create(harvestData: CreateHarvestDto): Promise<Harvest> {
    const newHarvest = new HarvestModel() as Loaded<HarvestModel, 'grower' | 'farm' | 'client' | 'commodity' | 'variety'>;

    await this.addDataToHarvest(newHarvest, harvestData);

    return HarvestTransformer.toDomain(newHarvest);
  }

  async findMany(page?: number): Promise<{ harvests: Harvest[]; count: number }> {
    const { harvests, count } = await this.getHarvests(page);

    return {
      harvests: harvests.map((harvest) => HarvestTransformer.toDomain(harvest)),
      count,
    };
  }

  async findById(id: UUID): Promise<Harvest> {
    const harvest = await this.getHarvest(id);

    return HarvestTransformer.toDomain(harvest);
  }

  // Private Methods
  private async addDataToHarvest(harvest: HarvestModel, harvestData: CreateHarvestDto) {
    try {
      const { grower, farm, client, commodity, variety } = harvestData;

      harvest.grower = getEntityManager().getReference(GrowerModel, grower.id, { wrapped: true });
      harvest.farm = getEntityManager().getReference(GrowerFarmModel, farm.id, { wrapped: true });
      harvest.client = getEntityManager().getReference(ClientModel, client.id, { wrapped: true });
      harvest.commodity = getEntityManager().getReference(CommodityModel, commodity.id, { wrapped: true });
      harvest.variety = getEntityManager().getReference(VarietyModel, variety.id, { wrapped: true });

      await getEntityManager().persistAndFlush(harvest);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async getHarvests(page?: number) {
    const [harvests, count] = await getEntityManager().findAndCount(
      HarvestModel,
      {},
      {
        populate: ['grower', 'farm', 'client', 'commodity', 'variety'],
        orderBy: {
          createdAt: 'DESC',
        },
        limit: page ? 10 : undefined,
        offset: page ? (page - 1) * 10 : undefined,
      }
    );

    return {
      harvests,
      count,
    };
  }

  private async getHarvest(id: UUID) {
    const harvest = await getEntityManager().findOne(
      HarvestModel,
      {
        id,
      },
      {
        populate: ['grower', 'farm', 'client', 'commodity', 'variety'],
      }
    );

    if (!harvest) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'harvest', type: ContextErrorType.NotFound }]);

    return harvest;
  }
}
