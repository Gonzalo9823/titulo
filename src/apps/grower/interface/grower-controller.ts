import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { container } from '~/apps/core/container';
import { TYPES } from '~/apps/core/container/injection-types';
import { CreateGrower } from '~/apps/grower/application/create-grower';
import { GetGrowerById } from '~/apps/grower/application/get-grower-by-id';
import { GetGrowers } from '~/apps/grower/application/get-growers';

export const GrowerController: FastifyPluginAsync = async (fastify): Promise<void> => {
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
      const createGrower = container.get<CreateGrower>(TYPES.CreateGrower);
      const grower = await createGrower.execute(request.body);

      reply.send({
        grower,
      });
    }
  );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const getGrowers = container.get<GetGrowers>(TYPES.GetGrowers);
      const { growers, count } = await getGrowers.execute(request.query?.page);

      reply.send({
        growers,
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:growerId', { schema: { params: z.object({ growerId: z.string().uuid() }) } }, async (request, reply) => {
      const getGrowerById = container.get<GetGrowerById>(TYPES.GetGrowerById);
      const grower = await getGrowerById.execute(request.params.growerId);

      reply.send({
        grower,
      });
    });
};
