import { injectable } from 'inversify';
import { EntityManager } from 'typeorm';

import { Commodity } from '~/apps/commodity/domain/commodity';
import { CommodityDBRepository, CreateCommodityDto } from '~/apps/commodity/domain/commodity-db-repository';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';
import { AppDataSource } from '~/infrastructure/type-orm';
import { CommodityModel } from '~/infrastructure/type-orm/entities/commodity';
import { VarietyModel } from '~/infrastructure/type-orm/entities/variety';
import { ErrorHandler } from '~/infrastructure/type-orm/error-handler';
import { CommodityTransformer } from '~/infrastructure/type-orm/transformers/commodity';

@injectable()
export class CommodityTypeORMRepository implements CommodityDBRepository {
  async create(commodityData: CreateCommodityDto): Promise<Commodity> {
    const newCommodity = new CommodityModel();

    await AppDataSource.transaction(async (transaction) => {
      await this.addDataToCommodity(transaction, newCommodity, commodityData);
      await this.addVarietiesToCommodity(transaction, newCommodity, commodityData.varieties);
    });

    return CommodityTransformer.toDomain(newCommodity);
  }

  async findMany(page?: number): Promise<{ commodities: Commodity[]; count: number }> {
    const { commodities, count } = await this.getCommodities(page);

    return {
      commodities: commodities.map((commodity) => CommodityTransformer.toDomain(commodity)),
      count,
    };
  }

  async findById(id: UUID): Promise<Commodity> {
    const commodity = await this.getCommodityById(id);

    return CommodityTransformer.toDomain(commodity);
  }

  // Private Methods
  private async addDataToCommodity(transaction: EntityManager, commodity: CommodityModel, commodityData: CreateCommodityDto): Promise<void> {
    try {
      const { name } = commodityData;

      commodity.name = name;
      commodity.varieties = [];

      await transaction.save(commodity);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async addVarietiesToCommodity(
    transaction: EntityManager,
    commodity: CommodityModel,
    varietiesData: CreateCommodityDto['varieties']
  ): Promise<void> {
    try {
      const newVarieties = varietiesData.map((name) => {
        const variety = new VarietyModel();

        variety.name = name;
        variety.commodity = commodity;

        return variety;
      });

      await transaction.save(newVarieties);
      commodity.varieties.push(...newVarieties);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async getCommodities(page?: number): Promise<{ commodities: CommodityModel[]; count: number }> {
    const [commodities, count] = await AppDataSource.getRepository(CommodityModel).findAndCount({
      relations: {
        varieties: true,
      },
      order: {
        createdAt: 'DESC',
        varieties: {
          createdAt: 'DESC',
        },
      },
      take: page ? 10 : undefined,
      skip: page ? (page - 1) * 10 : undefined,
    });

    return {
      commodities,
      count,
    };
  }

  private async getCommodityById(id: UUID): Promise<CommodityModel> {
    const commodity = await AppDataSource.getRepository(CommodityModel).findOne({
      relations: {
        varieties: true,
      },
      where: {
        id,
      },
    });

    if (!commodity) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'commodity', type: ContextErrorType.NotFound }]);

    return commodity;
  }
}
