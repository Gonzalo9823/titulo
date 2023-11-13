import { inject, injectable } from 'inversify';

import { Commodity } from '~/apps/commodity/domain/commodity';
import { CommodityDBRepository } from '~/apps/commodity/domain/commodity-db-repository';
import { TYPES } from '~/apps/core/container/injection-types';

@injectable()
export class GetCommodites {
  constructor(@inject(TYPES.CommodityDBRepository) private readonly commodityDBRepository: CommodityDBRepository) {}

  async execute(page?: number): Promise<{ commodities: Commodity[]; count: number }> {
    return this.commodityDBRepository.findMany(page);
  }
}
