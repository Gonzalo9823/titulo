import { UUID } from '~/apps/core/domain/uuid';
import { Grower } from '~/apps/grower/domain/grower';

export interface CreateGrowerDto {
  name: string;
  lastName: string;
  email: string;
  farms: {
    name: string;
    address: string;
  }[];
}

export interface GrowerDBRepository {
  create(growerData: CreateGrowerDto): Promise<Grower>;
  findMany(page?: number): Promise<{ growers: Grower[]; count: number }>;
  findById(id: UUID): Promise<Grower>;
}
