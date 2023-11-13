import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { AppDataSource } from '~/models/type-orm';
import { ClientModel } from '~/models/type-orm/entities/client';
import { ErrorHandler } from '~/models/type-orm/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const ClientTypeORMController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      { schema: { body: z.object({ name: z.string().trim().min(1), lastName: z.string().trim().min(1), email: z.string().email() }) } },
      async (request, reply) => {
        const client = new ClientModel();

        try {
          const { name, lastName, email } = request.body;

          client.name = name;
          client.lastName = lastName;
          client.email = email;

          await AppDataSource.getRepository(ClientModel).save(client);
        } catch (err) {
          throw ErrorHandler(err);
        }

        reply.send({
          client: {
            id: client.id,
            name: client.name,
            lastName: client.lastName,
            email: client.email,
          },
        });
      }
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const [clients, count] = await AppDataSource.getRepository(ClientModel).findAndCount({
        order: {
          createdAt: 'DESC',
        },
        take: request.query?.page ? 10 : undefined,
        skip: request.query?.page ? (request.query.page - 1) * 10 : undefined,
      });

      reply.send({
        clients: clients.map((client) => ({
          id: client.id,
          name: client.name,
          lastName: client.lastName,
          email: client.email,
        })),
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:clientId', { schema: { params: z.object({ clientId: z.string().uuid() }) } }, async (request, reply) => {
      const client = await AppDataSource.getRepository(ClientModel).findOne({
        where: {
          id: request.params.clientId,
        },
      });

      if (!client) throw new CustomError(ErrorType.Validation, ErrorCode.DataNotFound, [{ path: 'client', type: ContextErrorType.NotFound }]);

      reply.send({
        client: {
          id: client.id,
          name: client.name,
          lastName: client.lastName,
          email: client.email,
        },
      });
    });
};
