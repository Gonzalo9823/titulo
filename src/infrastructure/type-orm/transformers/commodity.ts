import { Commodity } from '~/apps/commodity/domain/commodity';
import { CommodityModel } from '~/infrastructure/type-orm/entities/commodity';
import { VarietyTransformer } from '~/infrastructure/type-orm/transformers/variety';

export class CommodityTransformer {
  static toDomain(commodity: PartialBy<CommodityModel, 'varieties'>): Commodity {
    const { id, name, varieties } = commodity;

    return {
      id,
      name,
      varieties: varieties?.map((variety) => VarietyTransformer.toDomain(variety)) || [],
    };
  }

  static toInfrastructure(commodity: PartialBy<Commodity, 'varieties'>): CommodityModel {
    const { id, name, varieties } = commodity;

    const commodityModel = new CommodityModel();

    commodityModel.id = id;
    commodityModel.name = name;
    commodityModel.varieties = varieties?.map((variety) => VarietyTransformer.toInfrastructure(variety)) || [];

    return commodityModel;
  }
}
