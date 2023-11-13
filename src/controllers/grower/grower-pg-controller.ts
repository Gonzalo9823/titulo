import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { pool } from '~/models/pg';
import { GrowerModel } from '~/models/pg/entities/grower';
import { GrowerFarmModel } from '~/models/pg/entities/grower-farm';
import { ErrorHandler } from '~/models/pg/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const GrowerPGController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      schema: {
        body: z.object({
          name: z.string().trim().min(1),
          lastName: z.string().trim().min(1),
          email: z.string().email(),
          farms: z.array(z.object({ name: z.string().trim().min(1), address: z.string().trim().min(1) })),
        }),
      },
    },
    async (request, reply) => {
      try {
        await pool.query('BEGIN');

        const { name, lastName, email, farms } = request.body;

        const resGrower = await pool.query<GrowerModel>(`INSERT INTO "growers" (name, last_name, email) VALUES ($1, $2, $3) RETURNING *`, [
          name,
          lastName,
          email,
        ]);

        const grower = resGrower.rows[0];

        let query = `INSERT INTO "grower_farms" (name, address, grower_id) VALUES`;
        const queryData: [string, string, string][] = [];

        farms.forEach(({ name, address }, idx) => {
          if (idx !== 0) query += ',';
          query += ' (';

          for (let col = 1; col <= 3; col++) {
            query += `$${idx * 3 + col}`;
            if (col < 3) query += ', ';
          }

          query += ')';

          queryData.push([name, address, grower.id]);
        });

        const resFarms = await pool.query<GrowerFarmModel>(
          `${query} RETURNING *`,
          queryData.flatMap((value) => value)
        );

        const _farms = resFarms.rows;

        reply.send({
          grower: {
            id: grower.id,
            name: grower.name,
            lastName: grower.last_name,
            email: grower.email,
            farms: _farms.map((farm) => ({
              id: farm.id,
              name: farm.name,
              address: farm.address,
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
      const count = await pool.query<{ count: number }>(`SELECT COUNT(*) FROM "growers"`);

      let growersQuery = `SELECT * FROM "growers" LEFT JOIN grower_farms on growers.id = grower_farms.grower_id`;
      const growersQueryValues = [];

      if (request.query?.page) {
        growersQuery += ` LIMIT 10 OFFSET $1`;
        growersQueryValues.push((request.query.page - 1) * 10);
      }

      const growers = (await pool.query<GrowerModel>(growersQuery, growersQueryValues)).rows;

      reply.send({
        growers: growers.map((grower) => ({
          id: grower.id,
          name: grower.name,
          lastName: grower.last_name,
          email: grower.email,
          farms: grower.farms.map((farm) => ({
            id: farm.id,
            name: farm.name,
            address: farm.address,
          })),
        })),
        count: count.rows[0].count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:growerId', { schema: { params: z.object({ growerId: z.string().uuid() }) } }, async (request, reply) => {
      const grower = (
        await pool.query<GrowerModel>(`SELECT * FROM "growers" LEFT JOIN grower_farms on growers.id = grower_farms.grower_id WHERE growers.id = $1`, [
          request.params.growerId,
        ])
      ).rows[0];

      if (!grower) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'grower', type: ContextErrorType.NotFound }]);

      reply.send({
        grower: {
          id: grower.id,
          name: grower.name,
          lastName: grower.last_name,
          email: grower.email,
          farms: grower.farms.map((farm) => ({
            id: farm.id,
            name: farm.name,
            address: farm.address,
          })),
        },
      });
    });
};
