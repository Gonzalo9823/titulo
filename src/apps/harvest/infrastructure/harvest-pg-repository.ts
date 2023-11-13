import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';
import { UUID } from '~/apps/core/domain/uuid';
import { Harvest } from '~/apps/harvest/domain/harvest';
import { CreateHarvestDto, HarvestDBRepository } from '~/apps/harvest/domain/harvest-db-repository';

import { pool } from '~/infrastructures/pg';
import { HarvestModel } from '~/infrastructures/pg/entities/harvest';
import { ErrorHandler } from '~/infrastructures/pg/error-handler';
import { HarvestTransformer } from '~/infrastructures/pg/transformers/harvest';

@injectable()
export class HarvestPGMRepository implements HarvestDBRepository {
  async create(harvestData: CreateHarvestDto): Promise<Harvest> {
    const newHarvest = await this.addDataToHarvest(harvestData);

    return HarvestTransformer.toDomain(newHarvest);
  }

  async findMany(page?: number): Promise<{ harvests: Harvest[]; count: number }> {
    const { harvests, count } = await this.getHarvests(page);

    return {
      harvests: harvests.map((harvest) => HarvestTransformer.toDomain(harvest)),
      count,
    };
  }

  async findById(id: UUID): Promise<Harvest> {
    const harvest = await this.getHarvest(id);

    return HarvestTransformer.toDomain(harvest);
  }

  // Private Methods
  private async addDataToHarvest(harvestData: CreateHarvestDto): Promise<HarvestModel> {
    try {
      const { grower, farm, client, commodity, variety } = harvestData;

      const res = await pool.query<HarvestModel>(
        `INSERT INTO "harvests" (grower_id, grower_farm_id, client_id, commodity_id, variety_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [grower.id, farm.id, client.id, commodity.id, variety.id]
      );

      return res.rows[0];
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async getHarvests(page?: number): Promise<{ harvests: HarvestModel[]; count: number }> {
    const count = await pool.query<{ count: number }>(`SELECT COUNT(*) FROM "harvests"`);

    let harvestsQuery = `SELECT * FROM "harvests" LEFT JOIN growers on growers.id = harvests.grower_id LEFT JOIN grower_farms on grower_farms.id = harvests.farm_id LEFT JOIN clients on clients.id = harvests.client_id LEFT JOIN commodities on commodities.id = harvests.commodity_id LEFT JOIN varieties on varieties.id = harvests.variety_id`;
    const harvestsQueryValues = [];

    if (page) {
      harvestsQuery += ` LIMIT 10 OFFSET $1`;
      harvestsQueryValues.push((page - 1) * 10);
    }

    const harvests = await pool.query<HarvestModel>(harvestsQuery, harvestsQueryValues);

    return {
      harvests: harvests.rows,
      count: count.rows[0].count,
    };
  }

  private async getHarvest(id: UUID): Promise<HarvestModel> {
    const harvest = (
      await pool.query<HarvestModel>(
        `SELECT * FROM "harvests" LEFT JOIN growers on growers.id = harvests.grower_id LEFT JOIN grower_farms on grower_farms.id = harvests.farm_id LEFT JOIN clients on clients.id = harvests.client_id LEFT JOIN commodities on commodities.id = harvests.commodity_id LEFT JOIN varieties on varieties.id = harvests.variety_id WHERE harvests.id = $1`,
        [id]
      )
    ).rows[0];

    if (!harvest) throw new CustomError(ErrorType.Validation, ErrorCode.DataNotFound, [{ path: 'harvest', type: ContextErrorType.NotFound }]);

    return harvest;
  }
}
