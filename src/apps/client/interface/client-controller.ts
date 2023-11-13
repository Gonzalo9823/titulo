import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { CreateClient } from '~/apps/client/application/create-client';
import { GetClientById } from '~/apps/client/application/get-client-by-id';
import { GetClients } from '~/apps/client/application/get-clients';
import { container } from '~/apps/core/container';
import { TYPES } from '~/apps/core/container/injection-types';

export const ClientController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      { schema: { body: z.object({ name: z.string().trim().min(1), lastName: z.string().trim().min(1), email: z.string().email() }) } },
      async (request, reply) => {
        const createClient = container.get<CreateClient>(TYPES.CreateClient);
        const client = await createClient.execute(request.body);

        reply.send({
          client,
        });
      }
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const getClients = container.get<GetClients>(TYPES.GetClients);
      const { clients, count } = await getClients.execute(request.query?.page);

      reply.send({
        clients,
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:clientId', { schema: { params: z.object({ clientId: z.string().uuid() }) } }, async (request, reply) => {
      const getClientById = container.get<GetClientById>(TYPES.GetClientById);
      const client = await getClientById.execute(request.params.clientId);

      reply.send({
        client,
      });
    });
};
