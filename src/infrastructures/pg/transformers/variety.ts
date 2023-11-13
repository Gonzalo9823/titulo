import { Variety } from '~/apps/commodity/domain/variety';

import { VarietyModel } from '~/infrastructures/pg/entities/variety';

export class VarietyTransformer {
  static toDomain(variety: Omit<VarietyModel, 'commodity'>): Variety {
    const { id, name } = variety;

    return {
      id,
      name,
    };
  }
}
