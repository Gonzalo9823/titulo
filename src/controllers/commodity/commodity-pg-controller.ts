import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { pool } from '~/models/pg';
import { CommodityModel } from '~/models/pg/entities/commodity';
import { VarietyModel } from '~/models/pg/entities/variety';
import { ErrorHandler } from '~/models/pg/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const CommodityPGController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      { schema: { body: z.object({ name: z.string().trim().min(1), varieties: z.array(z.string().trim().min(1)) }) } },
      async (request, reply) => {
        try {
          await pool.query('BEGIN');

          const resCommodity = await pool.query<CommodityModel>(`INSERT INTO "commodities" (name) VALUES ($1) RETURNING *`, [request.body.name]);
          const commodity = resCommodity.rows[0];

          let query = `INSERT INTO "varieties" (name, commodity_id) VALUES`;
          const queryData: [string, string][] = [];

          request.body.varieties.forEach((name, idx) => {
            if (idx !== 0) query += ',';
            query += ' (';

            for (let col = 1; col <= 2; col++) {
              query += `$${idx * 2 + col}`;
              if (col < 2) query += ', ';
            }

            query += ')';

            queryData.push([name, commodity.id]);
          });

          const resVarieties = await pool.query<VarietyModel>(
            `${query} RETURNING *`,
            queryData.flatMap((value) => value)
          );

          const varieties = resVarieties.rows;

          await pool.query('COMMIT');

          reply.send({
            commodity: {
              id: commodity.id,
              name: commodity.name,
              varieties: varieties.map((variety) => ({
                id: variety.id,
                name: variety.name,
              })),
            },
          });
        } catch (err) {
          await pool.query('ROLLBACK');
          throw ErrorHandler(err);
        }
      }
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const count = await pool.query<{ count: number }>(`SELECT COUNT(*) FROM "commodities"`);

      let commoditiesQuery = `SELECT * FROM "commodities" LEFT JOIN varieties on commodities.id = varieties.commodity_id`;
      const commoditiesQueryValues = [];

      if (request.query?.page) {
        commoditiesQuery += ` LIMIT 10 OFFSET $1`;
        commoditiesQueryValues.push((request.query.page - 1) * 10);
      }

      const commodities = (await pool.query<CommodityModel>(commoditiesQuery, commoditiesQueryValues)).rows;

      reply.send({
        commodities: commodities.map((commodity) => ({
          id: commodity.id,
          name: commodity.name,
          varieties: commodity.varieties.map((variety) => ({
            id: variety.id,
            name: variety.name,
          })),
        })),
        count: count.rows[0].count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:commodityId', { schema: { params: z.object({ commodityId: z.string().uuid() }) } }, async (request, reply) => {
      const commodity = (
        await pool.query<CommodityModel>(
          `SELECT * FROM "commodities" LEFT JOIN varieties on commodities.id = varieties.commodity_id WHERE commodities.id = $1`,
          [request.params.commodityId]
        )
      ).rows[0];

      if (!commodity) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'commodity', type: ContextErrorType.NotFound }]);

      reply.send({
        commodity: {
          id: commodity.id,
          name: commodity.name,
          varieties: commodity.varieties.map((variety) => ({
            id: variety.id,
            name: variety.name,
          })),
        },
      });
    });
};
