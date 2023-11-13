import { Loaded, wrap } from '@mikro-orm/core';
import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';
import { Grower } from '~/apps/grower/domain/grower';
import { CreateGrowerDto, GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';

import { getEntityManager } from '~/infrastructures/mikro-orm';
import { GrowerModel } from '~/infrastructures/mikro-orm/entities/grower';
import { GrowerFarmModel } from '~/infrastructures/mikro-orm/entities/grower-farm';
import { ErrorHandler } from '~/infrastructures/mikro-orm/error-handler';
import { GrowerTransformer } from '~/infrastructures/mikro-orm/transformers/grower';

@injectable()
export class GrowerMikroORMRepository implements GrowerDBRepository {
  async create(growerData: CreateGrowerDto): Promise<Grower> {
    const newGrower = new GrowerModel() as Loaded<GrowerModel, 'farms'>;

    this.addDataToGrower(newGrower, growerData);
    this.addFarmsToGrower(newGrower, growerData.farms);

    await getEntityManager()
      .flush()
      .catch((err) => {
        throw ErrorHandler(err);
      });

    return GrowerTransformer.toDomain(newGrower);
  }

  async findMany(page?: number): Promise<{ growers: Grower[]; count: number }> {
    const { growers, count } = await this.getGrowers(page);

    return {
      growers: growers.map((grower) => GrowerTransformer.toDomain(grower)),
      count,
    };
  }

  async findById(id: UUID): Promise<Grower> {
    const grower = await this.getGrower(id);

    return GrowerTransformer.toDomain(grower);
  }

  // Private Methods
  private addDataToGrower(grower: GrowerModel, growerData: CreateGrowerDto) {
    const { name, lastName, email } = growerData;

    grower.name = name;
    grower.lastName = lastName;
    grower.email = email;

    getEntityManager().persist(grower);
  }

  private addFarmsToGrower(grower: GrowerModel, growerFarmsData: CreateGrowerDto['farms']) {
    growerFarmsData.forEach(({ name, address }) => {
      const growerFarm = new GrowerFarmModel();

      growerFarm.name = name;
      growerFarm.address = address;
      growerFarm.grower = wrap(grower).toReference();

      getEntityManager().persist(growerFarm);
      grower.farms.add(growerFarm);
    });
  }

  private async getGrowers(page?: number) {
    const [growers, count] = await getEntityManager().findAndCount(
      GrowerModel,
      {},
      {
        populate: ['farms'],
        orderBy: {
          createdAt: 'DESC',
          farms: {
            createdAt: 'DESC',
          },
        },
        limit: page ? 10 : undefined,
        offset: page ? (page - 1) * 10 : undefined,
      }
    );

    return {
      growers,
      count,
    };
  }

  private async getGrower(id: UUID) {
    const grower = await getEntityManager().findOne(
      GrowerModel,
      {
        id,
      },
      {
        populate: ['farms'],
        orderBy: {
          farms: {
            createdAt: 'DESC',
          },
        },
      }
    );

    if (!grower) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'grower', type: ContextErrorType.NotFound }]);

    return grower;
  }
}
