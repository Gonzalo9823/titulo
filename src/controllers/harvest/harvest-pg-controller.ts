import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { pool } from '~/models/pg';
import { ClientModel } from '~/models/pg/entities/client';
import { CommodityModel } from '~/models/pg/entities/commodity';
import { GrowerModel } from '~/models/pg/entities/grower';
import { GrowerFarmModel } from '~/models/pg/entities/grower-farm';
import { HarvestModel } from '~/models/pg/entities/harvest';
import { VarietyModel } from '~/models/pg/entities/variety';
import { ErrorHandler } from '~/models/pg/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const HarvestPGController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      schema: {
        body: z.object({
          growerId: z.string().uuid(),
          farmId: z.string().uuid(),
          clientId: z.string().uuid(),
          commodityId: z.string().uuid(),
          varietyId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { growerId, farmId, clientId, commodityId, varietyId } = request.body;

      try {
        const grower = (await pool.query<GrowerModel>(`SELECT * FROM "growers" WHERE id = $1`, [growerId])).rows[0];
        const farm = (await pool.query<GrowerFarmModel>(`SELECT * FROM "grower_farms" WHERE id = $1`, [farmId])).rows[0];
        const client = (await pool.query<ClientModel>(`SELECT * FROM "clients" WHERE id = $1`, [clientId])).rows[0];
        const commodity = (await pool.query<CommodityModel>(`SELECT * FROM "commodities" WHERE id = $1`, [commodityId])).rows[0];
        const variety = (await pool.query<VarietyModel>(`SELECT * FROM "varieties" WHERE id = $1`, [varietyId])).rows[0];

        const res = await pool.query<HarvestModel>(
          `INSERT INTO "harvests" (grower_id, grower_farm_id, client_id, commodity_id, variety_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [grower.id, farm.id, client.id, commodity.id, variety.id]
        );

        const harvest = res.rows[0];

        reply.send({
          harvest: {
            id: harvest.id,
            grower: {
              id: grower.id,
              name: grower.name,
              lastName: grower.last_name,
              email: grower.email,
            },
            farm: {
              id: farm.id,
              name: farm.name,
              address: farm.address,
            },
            client: {
              id: client.id,
              name: client.name,
              lastName: client.last_name,
              email: client.email,
            },
            commodity: {
              id: commodity.id,
              name: commodity.name,
            },
            variety: {
              id: variety.id,
              name: variety.name,
            },
            createdAt: harvest.created_at,
          },
        });
      } catch (err) {
        throw ErrorHandler(err);
      }
    }
  );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const count = await pool.query<{ count: number }>(`SELECT COUNT(*) FROM "harvests"`);

      let harvestsQuery = `SELECT * FROM "harvests" LEFT JOIN growers on growers.id = harvests.grower_id LEFT JOIN grower_farms on grower_farms.id = harvests.farm_id LEFT JOIN clients on clients.id = harvests.client_id LEFT JOIN commodities on commodities.id = harvests.commodity_id LEFT JOIN varieties on varieties.id = harvests.variety_id`;
      const harvestsQueryValues = [];

      if (request.query?.page) {
        harvestsQuery += ` LIMIT 10 OFFSET $1`;
        harvestsQueryValues.push((request.query?.page - 1) * 10);
      }

      const harvests = (await pool.query<HarvestModel>(harvestsQuery, harvestsQueryValues)).rows;

      reply.send({
        harvests: harvests.map((harvest) => ({
          id: harvest.id,
          grower: {
            id: harvest.grower.id,
            name: harvest.grower.name,
            lastName: harvest.grower.last_name,
            email: harvest.grower.email,
          },
          farm: {
            id: harvest.farm.id,
            name: harvest.farm.name,
            address: harvest.farm.address,
          },
          client: {
            id: harvest.client.id,
            name: harvest.client.name,
            lastName: harvest.client.last_name,
            email: harvest.client.email,
          },
          commodity: {
            id: harvest.commodity.id,
            name: harvest.commodity.name,
          },
          variety: {
            id: harvest.variety.id,
            name: harvest.variety.name,
          },
          createdAt: harvest.created_at,
        })),
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:harvestId', { schema: { params: z.object({ harvestId: z.string().uuid() }) } }, async (request, reply) => {
      const harvest = (
        await pool.query<HarvestModel>(
          `SELECT * FROM "harvests" LEFT JOIN growers on growers.id = harvests.grower_id LEFT JOIN grower_farms on grower_farms.id = harvests.farm_id LEFT JOIN clients on clients.id = harvests.client_id LEFT JOIN commodities on commodities.id = harvests.commodity_id LEFT JOIN varieties on varieties.id = harvests.variety_id WHERE harvests.id = $1`,
          [request.params.harvestId]
        )
      ).rows[0];

      if (!harvest) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'harvest', type: ContextErrorType.NotFound }]);

      reply.send({
        harvest: {
          id: harvest.id,
          grower: {
            id: harvest.grower.id,
            name: harvest.grower.name,
            lastName: harvest.grower.last_name,
            email: harvest.grower.email,
          },
          farm: {
            id: harvest.farm.id,
            name: harvest.farm.name,
            address: harvest.farm.address,
          },
          client: {
            id: harvest.client.id,
            name: harvest.client.name,
            lastName: harvest.client.last_name,
            email: harvest.client.email,
          },
          commodity: {
            id: harvest.commodity.id,
            name: harvest.commodity.name,
          },
          variety: {
            id: harvest.variety.id,
            name: harvest.variety.name,
          },
          createdAt: harvest.created_at,
        },
      });
    });
};
