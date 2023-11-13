import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { container } from '~/apps/core/container';
import { TYPES } from '~/apps/core/container/injection-types';
import { CreateHarvest } from '~/apps/harvest/application/create-harvest';
import { GetHarvestById } from '~/apps/harvest/application/get-harvest-by-id';
import { GetHarvests } from '~/apps/harvest/application/get-harvests';

export const HarvestController: FastifyPluginAsync = async (fastify): Promise<void> => {
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
      const createHarvest = container.get<CreateHarvest>(TYPES.CreateHarvest);
      const harvest = await createHarvest.execute(request.body);

      reply.send({
        harvest,
      });
    }
  );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const getHarvests = container.get<GetHarvests>(TYPES.GetHarvests);
      const { harvests, count } = await getHarvests.execute(request.query?.page);

      reply.send({
        harvests,
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:harvestId', { schema: { params: z.object({ harvestId: z.string().uuid() }) } }, async (request, reply) => {
      const getHarvestById = container.get<GetHarvestById>(TYPES.GetHarvestById);
      const harvest = await getHarvestById.execute(request.params.harvestId);

      reply.send({
        harvest,
      });
    });
};
