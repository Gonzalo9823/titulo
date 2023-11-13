import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';
import { Harvest } from '~/apps/harvest/domain/harvest';
import { CreateHarvestDto, HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';

import { AppDataSource } from '~/infrastructures/type-orm';
import { HarvestModel } from '~/infrastructures/type-orm/entities/harvest';
import { ErrorHandler } from '~/infrastructures/type-orm/error-handler';
import { ClientTransformer } from '~/infrastructures/type-orm/transformers/client';
import { CommodityTransformer } from '~/infrastructures/type-orm/transformers/commodity';
import { GrowerTransformer } from '~/infrastructures/type-orm/transformers/grower';
import { GrowerFarmTransformer } from '~/infrastructures/type-orm/transformers/grower-farm';
import { HarvestTransformer } from '~/infrastructures/type-orm/transformers/harvest';
import { VarietyTransformer } from '~/infrastructures/type-orm/transformers/variety';

@injectable()
export class HarvestTypeORMRepository implements HarvestDBRepository {
  async create(harvestData: CreateHarvestDto): Promise<Harvest> {
    const newHarvest = new HarvestModel();

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
  private async addDataToHarvest(harvest: HarvestModel, harvestData: CreateHarvestDto): Promise<void> {
    try {
      const { grower, farm, client, commodity, variety } = harvestData;

      harvest.grower = GrowerTransformer.toInfrastructure(grower);
      harvest.farm = GrowerFarmTransformer.toInfrastructure(farm);
      harvest.client = ClientTransformer.toInfrastructure(client);
      harvest.commodity = CommodityTransformer.toInfrastructure(commodity);
      harvest.variety = VarietyTransformer.toInfrastructure(variety);

      await AppDataSource.getRepository(HarvestModel).save(harvest);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async getHarvests(page?: number): Promise<{ harvests: HarvestModel[]; count: number }> {
    const [harvests, count] = await AppDataSource.getRepository(HarvestModel).findAndCount({
      relations: {
        grower: true,
        farm: true,
        client: true,
        commodity: true,
        variety: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: page ? 10 : undefined,
      skip: page ? (page - 1) * 10 : undefined,
    });

    return {
      harvests,
      count,
    };
  }

  private async getHarvest(id: UUID): Promise<HarvestModel> {
    const harvest = await AppDataSource.getRepository(HarvestModel).findOne({
      relations: {
        grower: true,
        farm: true,
        client: true,
        commodity: true,
        variety: true,
      },
      where: {
        id,
      },
    });

    if (!harvest) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'harvest', type: ContextErrorType.NotFound }]);

    return harvest;
  }
}
