import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { pool } from '~/models/pg';
import { ClientModel } from '~/models/pg/entities/client';
import { ErrorHandler } from '~/models/pg/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const ClientPGController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      { schema: { body: z.object({ name: z.string().trim().min(1), lastName: z.string().trim().min(1), email: z.string().email() }) } },
      async (request, reply) => {
        try {
          const { name, lastName, email } = request.body;

          const res = await pool.query<ClientModel>(`INSERT INTO "clients" (name, last_name, email) VALUES ($1, $2, $3) RETURNING *`, [
            name,
            lastName,
            email,
          ]);

          const client = res.rows[0];

          reply.send({
            client: {
              id: client.id,
              name: client.name,
              lastName: client.last_name,
              email: client.email,
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
      const count = await pool.query<{ count: number }>(`SELECT COUNT(*) FROM "clients"`);

      let clientsQuery = `SELECT * FROM "clients"`;
      const clientsQueryValues = [];

      if (request.query?.page) {
        clientsQuery += ` LIMIT 10 OFFSET $1`;
        clientsQueryValues.push((request.query.page - 1) * 10);
      }

      const clients = await pool.query<ClientModel>(clientsQuery, clientsQueryValues);

      reply.send({
        clients: clients.rows.map((client) => ({
          id: client.id,
          name: client.name,
          lastName: client.last_name,
          email: client.email,
        })),
        count: count.rows[0].count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:clientId', { schema: { params: z.object({ clientId: z.string().uuid() }) } }, async (request, reply) => {
      const client = (await pool.query<ClientModel>(`SELECT * FROM "clients" WHERE id = $1`, [request.params.clientId])).rows[0];

      if (!client) throw new CustomError(ErrorType.Validation, ErrorCode.DataNotFound, [{ path: 'client', type: ContextErrorType.NotFound }]);

      reply.send({
        client: {
          id: client.id,
          name: client.name,
          lastName: client.last_name,
          email: client.email,
        },
      });
    });
};
