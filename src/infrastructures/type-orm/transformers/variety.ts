import { Variety } from '~/apps/commodity/domain/variety';

import { VarietyModel } from '~/infrastructures/type-orm/entities/variety';

export class VarietyTransformer {
  static toDomain(variety: VarietyModel): Variety {
    const { id, name } = variety;

    return {
      id,
      name,
    };
  }

  static toInfrastructure(variety: Variety): VarietyModel {
    const { id, name } = variety;

    const varietyModel = new VarietyModel();

    varietyModel.id = id;
    varietyModel.name = name;

    return varietyModel;
  }
}
