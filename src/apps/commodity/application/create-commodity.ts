import { inject, injectable } from 'inversify';

import { Commodity } from '~/apps/commodity/domain/commodity';
import { CommodityDBRepository, CreateCommodityDto } from '~/apps/commodity/domain/commodity-db-repository';
import { TYPES } from '~/apps/core/container/injection-types';

@injectable()
export class CreateCommodity {
  constructor(@inject(TYPES.CommodityDBRepository) private readonly commodityDBRepository: CommodityDBRepository) {}

  async execute(commodityData: CreateCommodityDto): Promise<Commodity> {
    return this.commodityDBRepository.create(commodityData);
  }
}
