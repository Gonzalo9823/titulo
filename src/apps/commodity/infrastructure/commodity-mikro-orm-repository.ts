import { Loaded, wrap } from '@mikro-orm/core';
import { injectable } from 'inversify';

import { Commodity } from '~/apps/commodity/domain/commodity';
import { CommodityDBRepository, CreateCommodityDto } from '~/apps/commodity/domain/commodity-db-repository';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';

import { getEntityManager } from '~/infrastructures/mikro-orm';
import { CommodityModel } from '~/infrastructures/mikro-orm/entities/commodity';
import { VarietyModel } from '~/infrastructures/mikro-orm/entities/variety';
import { ErrorHandler } from '~/infrastructures/mikro-orm/error-handler';
import { CommodityTransformer } from '~/infrastructures/mikro-orm/transformers/commodity';

@injectable()
export class CommodityMikroORMRepository implements CommodityDBRepository {
  async create(commodityData: CreateCommodityDto): Promise<Commodity> {
    const newCommodity = new CommodityModel() as Loaded<CommodityModel, 'varieties'>;

    this.addDataToCommodity(newCommodity, commodityData);
    this.addVarietiesToCommodity(newCommodity, commodityData.varieties);

    await getEntityManager()
      .flush()
      .catch((err) => {
        throw ErrorHandler(err);
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

  async findById(id: string): Promise<Commodity> {
    const commodity = await this.getCommodity(id);

    return CommodityTransformer.toDomain(commodity);
  }

  // Private Methods
  private addDataToCommodity(commodity: CommodityModel, commodityData: CreateCommodityDto) {
    const { name } = commodityData;

    commodity.name = name;

    getEntityManager().persist(commodity);
  }

  private addVarietiesToCommodity(commodity: CommodityModel, varietiesData: CreateCommodityDto['varieties']) {
    varietiesData.forEach((name) => {
      const variety = new VarietyModel();

      variety.name = name;
      variety.commodity = wrap(commodity).toReference();

      getEntityManager().persist(variety);
      commodity.varieties.add(variety);
    });
  }

  private async getCommodities(page?: number) {
    const [commodities, count] = await getEntityManager().findAndCount(
      CommodityModel,
      {},
      {
        populate: ['varieties'],
        orderBy: {
          createdAt: 'DESC',
          varieties: {
            createdAt: 'DESC',
          },
        },
        limit: page ? 10 : undefined,
        offset: page ? (page - 1) * 10 : undefined,
      }
    );

    return {
      commodities,
      count,
    };
  }

  private async getCommodity(id: UUID) {
    const commodity = await getEntityManager().findOne(
      CommodityModel,
      {
        id,
      },
      {
        populate: ['varieties'],
        orderBy: {
          varieties: {
            createdAt: 'DESC',
          },
        },
      }
    );

    if (!commodity) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'commodity', type: ContextErrorType.NotFound }]);

    return commodity;
  }
}
