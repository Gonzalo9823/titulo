import { injectable } from 'inversify';

import { Commodity } from '~/apps/commodity/domain/commodity';
import { CommodityDBRepository, CreateCommodityDto } from '~/apps/commodity/domain/commodity-db-repository';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';

import { pool } from '~/infrastructures/pg';
import { CommodityModel } from '~/infrastructures/pg/entities/commodity';
import { VarietyModel } from '~/infrastructures/pg/entities/variety';
import { ErrorHandler } from '~/infrastructures/pg/error-handler';
import { CommodityTransformer } from '~/infrastructures/pg/transformers/commodity';

@injectable()
export class CommodityPGRepository implements CommodityDBRepository {
  async create(commodityData: CreateCommodityDto): Promise<Commodity> {
    await pool.query('BEGIN');
    const newCommodity = await this.addDataToCommodity(commodityData);
    const newVarieties = await this.addVarietiesToCommodity(newCommodity, commodityData.varieties);
    await pool.query('COMMIT');

    return CommodityTransformer.toDomain({ ...newCommodity, varieties: newVarieties });
  }

  async findMany(page?: number): Promise<{ commodities: Commodity[]; count: number }> {
    const { commodities, count } = await this.getCommodities(page);

    return {
      commodities: commodities.map((commodity) => CommodityTransformer.toDomain(commodity)),
      count,
    };
  }

  async findById(id: UUID): Promise<Commodity> {
    const commodity = await this.getCommodity(id);

    return CommodityTransformer.toDomain(commodity);
  }

  // Private Methods
  private async addDataToCommodity(commodityData: CreateCommodityDto): Promise<CommodityModel> {
    try {
      const { name } = commodityData;

      const res = await pool.query<CommodityModel>(`INSERT INTO "commodities" (name) VALUES ($1) RETURNING *`, [name]);

      return res.rows[0];
    } catch (err) {
      await pool.query('ROLLBACK');
      throw ErrorHandler(err);
    }
  }

  private async addVarietiesToCommodity(commodity: CommodityModel, varietiesData: CreateCommodityDto['varieties']): Promise<VarietyModel[]> {
    let query = `INSERT INTO "varieties" (name, commodity_id) VALUES`;
    const queryData: [string, string][] = [];

    varietiesData.forEach((name, idx) => {
      if (idx !== 0) query += ',';
      query += ' (';

      for (let col = 1; col <= 2; col++) {
        query += `$${idx * 2 + col}`;
        if (col < 2) query += ', ';
      }

      query += ')';

      queryData.push([name, commodity.id]);
    });

    try {
      const res = await pool.query<VarietyModel>(
        `${query} RETURNING *`,
        queryData.flatMap((value) => value)
      );

      return res.rows;
    } catch (err) {
      await pool.query('ROLLBACK');
      throw ErrorHandler(err);
    }
  }

  private async getCommodities(page?: number): Promise<{ commodities: CommodityModel[]; count: number }> {
    const count = await pool.query<{ count: number }>(`SELECT COUNT(*) FROM "commodities"`);

    let commoditiesQuery = `SELECT * FROM "commodities" LEFT JOIN varieties on commodities.id = varieties.commodity_id`;
    const commoditiesQueryValues = [];

    if (page) {
      commoditiesQuery += ` LIMIT 10 OFFSET $1`;
      commoditiesQueryValues.push((page - 1) * 10);
    }

    const commodities = await pool.query<CommodityModel>(commoditiesQuery, commoditiesQueryValues);

    return {
      commodities: commodities.rows,
      count: count.rows[0].count,
    };
  }

  private async getCommodity(id: UUID): Promise<CommodityModel> {
    const commodity = (
      await pool.query<CommodityModel>(
        `SELECT * FROM "commodities" LEFT JOIN varieties on commodities.id = varieties.commodity_id WHERE commodities.id = $1`,
        [id]
      )
    ).rows[0];

    if (!commodity) throw new CustomError(ErrorType.Validation, ErrorCode.DataNotFound, [{ path: 'commodity', type: ContextErrorType.NotFound }]);

    return commodity;
  }
}
