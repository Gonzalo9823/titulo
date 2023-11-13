import { injectable } from 'inversify';
import { EntityManager } from 'typeorm';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';
import { Grower } from '~/apps/grower/domain/grower';
import { CreateGrowerDto, GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';
import { AppDataSource } from '~/infrastructure/type-orm';
import { GrowerModel } from '~/infrastructure/type-orm/entities/grower';
import { GrowerFarmModel } from '~/infrastructure/type-orm/entities/grower-farm';
import { ErrorHandler } from '~/infrastructure/type-orm/error-handler';
import { GrowerTransformer } from '~/infrastructure/type-orm/transformers/grower';

@injectable()
export class GrowerTypeORMRepository implements GrowerDBRepository {
  async create(growerData: CreateGrowerDto): Promise<Grower> {
    const newGrower = new GrowerModel();

    await AppDataSource.transaction(async (transaction) => {
      await this.addDataToGrower(transaction, newGrower, growerData);
      await this.addFarmsToGrower(transaction, newGrower, growerData.farms);
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
  private async addDataToGrower(transaction: EntityManager, grower: GrowerModel, growerData: CreateGrowerDto): Promise<void> {
    try {
      const { name, lastName, email } = growerData;

      grower.name = name;
      grower.lastName = lastName;
      grower.email = email;
      grower.farms = [];

      await transaction.save(grower);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async addFarmsToGrower(transaction: EntityManager, grower: GrowerModel, growerFarmsData: CreateGrowerDto['farms']): Promise<void> {
    try {
      const newGrowerFarms = growerFarmsData.map(({ name, address }) => {
        const growerFarm = new GrowerFarmModel();

        growerFarm.name = name;
        growerFarm.address = address;
        growerFarm.grower = grower;

        return growerFarm;
      });

      await transaction.save(newGrowerFarms);
      grower.farms.push(...newGrowerFarms);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async getGrowers(page?: number): Promise<{ growers: GrowerModel[]; count: number }> {
    const [growers, count] = await AppDataSource.getRepository(GrowerModel).findAndCount({
      relations: {
        farms: true,
      },
      order: {
        createdAt: 'DESC',
        farms: {
          createdAt: 'DESC',
        },
      },
      take: page ? 10 : undefined,
      skip: page ? (page - 1) * 10 : undefined,
    });

    return {
      growers,
      count,
    };
  }

  private async getGrower(id: UUID): Promise<GrowerModel> {
    const grower = await AppDataSource.getRepository(GrowerModel).findOne({
      relations: {
        farms: true,
      },
      where: {
        id,
      },
    });

    if (!grower) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'grower', type: ContextErrorType.NotFound }]);

    return grower;
  }
}
