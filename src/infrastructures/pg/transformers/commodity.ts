import { Commodity } from '~/apps/commodity/domain/commodity';

import { CommodityModel } from '~/infrastructures/pg/entities/commodity';
import { VarietyTransformer } from '~/infrastructures/pg/transformers/variety';

export class CommodityTransformer {
  static toDomain(commodity: CommodityModel): Commodity;
  static toDomain(commodity: Omit<CommodityModel, 'varieties'>): Omit<Commodity, 'varieties'>;
  static toDomain(commodity: CommodityModel | PartialBy<CommodityModel, 'varieties'>): Commodity | Omit<Commodity, 'varieties'> {
    const { id, name, varieties } = commodity;

    const _varieties = varieties ? varieties.map((variety) => VarietyTransformer.toDomain(variety)) : undefined;

    return {
      id,
      name,
      ...(_varieties ? { varieties: _varieties } : {}),
    };
  }
}
