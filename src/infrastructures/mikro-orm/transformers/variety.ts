import { Variety } from '~/apps/commodity/domain/variety';

import { VarietyModel } from '~/infrastructures/mikro-orm/entities/variety';

export class VarietyTransformer {
  static toDomain(variety: VarietyModel): Variety {
    const { id, name } = variety;

    return {
      id,
      name,
    };
  }
}
