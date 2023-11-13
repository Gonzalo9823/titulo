import { Loaded } from '@mikro-orm/core';

import { Commodity } from '~/apps/commodity/domain/commodity';

import { CommodityModel } from '~/infrastructures/mikro-orm/entities/commodity';
import { isCollectionInitialized } from '~/infrastructures/mikro-orm/transformers/util/is-collection-initialized';
import { VarietyTransformer } from '~/infrastructures/mikro-orm/transformers/variety';

export class CommodityTransformer {
  static toDomain(commodity: Loaded<CommodityModel, 'varieties'>): Commodity;
  static toDomain(commodity: Loaded<CommodityModel>): Omit<Commodity, 'varieties'>;
  static toDomain(commodity: Loaded<CommodityModel, 'varieties'> | Loaded<CommodityModel>): Commodity | Omit<Commodity, 'varieties'> {
    const { id, name, varieties } = commodity;

    const _varieties = isCollectionInitialized(varieties) ? varieties.$.map((variety) => VarietyTransformer.toDomain(variety)) : undefined;

    return {
      id,
      name,
      ...(_varieties ? { varieties: _varieties } : {}),
    };
  }
}
