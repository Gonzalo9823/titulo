import { Commodity } from '~/apps/commodity/domain/commodity';
import { UUID } from '~/apps/core/domain/uuid';

export interface CreateCommodityDto {
  name: string;
  varieties: string[];
}

export interface CommodityDBRepository {
  create(commodityData: CreateCommodityDto): Promise<Commodity>;
  findMany(page?: number): Promise<{ commodities: Commodity[]; count: number }>;
  findById(id: UUID): Promise<Commodity>;
}
