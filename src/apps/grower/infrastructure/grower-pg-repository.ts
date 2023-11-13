import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';
import { Grower } from '~/apps/grower/domain/grower';
import { CreateGrowerDto, GrowerDBRepository } from '~/apps/grower/domain/grower-db-repository';

import { pool } from '~/infrastructures/pg';
import { GrowerModel } from '~/infrastructures/pg/entities/grower';
import { GrowerFarmModel } from '~/infrastructures/pg/entities/grower-farm';
import { ErrorHandler } from '~/infrastructures/pg/error-handler';
import { GrowerTransformer } from '~/infrastructures/pg/transformers/grower';

@injectable()
export class GrowerPGMRepository implements GrowerDBRepository {
  async create(growerData: CreateGrowerDto): Promise<Grower> {
    await pool.query('BEGIN');
    const newGrower = await this.addDataToGrower(growerData);
    const newFarms = await this.addFarmsToGrower(newGrower, growerData.farms);
    await pool.query('COMMIT');

    return GrowerTransformer.toDomain({ ...newGrower, farms: newFarms });
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
  private async addDataToGrower(growerData: CreateGrowerDto): Promise<GrowerModel> {
    try {
      const { name, lastName, email } = growerData;

      const res = await pool.query<GrowerModel>(`INSERT INTO "growers" (name, last_name, email) VALUES ($1, $2, $3) RETURNING *`, [
        name,
        lastName,
        email,
      ]);

      return res.rows[0];
    } catch (err) {
      await pool.query('ROLLBACK');
      throw ErrorHandler(err);
    }
  }

  private async addFarmsToGrower(grower: GrowerModel, growerFarmsData: CreateGrowerDto['farms']): Promise<GrowerFarmModel[]> {
    let query = `INSERT INTO "grower_farms" (name, address, grower_id) VALUES`;
    const queryData: [string, string, string][] = [];

    growerFarmsData.forEach(({ name, address }, idx) => {
      if (idx !== 0) query += ',';
      query += ' (';

      for (let col = 1; col <= 3; col++) {
        query += `$${idx * 3 + col}`;
        if (col < 3) query += ', ';
      }

      query += ')';

      queryData.push([name, address, grower.id]);
    });

    try {
      const res = await pool.query<GrowerFarmModel>(
        `${query} RETURNING *`,
        queryData.flatMap((value) => value)
      );

      return res.rows;
    } catch (err) {
      await pool.query('ROLLBACK');
      throw ErrorHandler(err);
    }
  }

  private async getGrowers(page?: number): Promise<{ growers: GrowerModel[]; count: number }> {
    const count = await pool.query<{ count: number }>(`SELECT COUNT(*) FROM "growers"`);

    let growersQuery = `SELECT * FROM "growers" LEFT JOIN grower_farms on growers.id = grower_farms.grower_id`;
    const growersQueryValues = [];

    if (page) {
      growersQuery += ` LIMIT 10 OFFSET $1`;
      growersQueryValues.push((page - 1) * 10);
    }

    const growers = await pool.query<GrowerModel>(growersQuery, growersQueryValues);

    return {
      growers: growers.rows,
      count: count.rows[0].count,
    };
  }

  private async getGrower(id: UUID): Promise<GrowerModel> {
    const grower = (
      await pool.query<GrowerModel>(`SELECT * FROM "growers" LEFT JOIN grower_farms on growers.id = grower_farms.grower_id WHERE growers.id = $1`, [
        id,
      ])
    ).rows[0];

    if (!grower) throw new CustomError(ErrorType.Validation, ErrorCode.DataNotFound, [{ path: 'grower', type: ContextErrorType.NotFound }]);

    return grower;
  }
}
