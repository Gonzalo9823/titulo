import { inject, injectable } from 'inversify';

import { Commodity } from '~/apps/commodity/domain/commodity';
import { CommodityDBRepository } from '~/apps/commodity/domain/commodity-db-repository';
import { TYPES } from '~/apps/core/container/injection-types';
import { UUID } from '~/apps/core/domain/uuid';

@injectable()
export class GetCommodityById {
  constructor(@inject(TYPES.CommodityDBRepository) private readonly commodityDBRepository: CommodityDBRepository) {}

  async execute(id: UUID): Promise<Commodity> {
    return this.commodityDBRepository.findById(id);
  }
}
