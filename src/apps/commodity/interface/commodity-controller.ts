import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { CreateCommodity } from '~/apps/commodity/application/create-commodity';
import { GetCommodityById } from '~/apps/commodity/application/get-commmodity-by-id';
import { GetCommodites } from '~/apps/commodity/application/get-commodities';
import { container } from '~/apps/core/container';
import { TYPES } from '~/apps/core/container/injection-types';

export const CommodityController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      { schema: { body: z.object({ name: z.string().trim().min(1), varieties: z.array(z.string().trim().min(1)) }) } },
      async (request, reply) => {
        const createCommodity = container.get<CreateCommodity>(TYPES.CreateCommodity);
        const commodity = await createCommodity.execute(request.body);

        reply.send({
          commodity,
        });
      }
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const getCommodites = container.get<GetCommodites>(TYPES.GetCommodities);
      const { commodities, count } = await getCommodites.execute(request.query?.page);

      reply.send({
        commodities,
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:commodityId', { schema: { params: z.object({ commodityId: z.string().uuid() }) } }, async (request, reply) => {
      const getCommodityById = container.get<GetCommodityById>(TYPES.GetCommodityById);
      const commodity = await getCommodityById.execute(request.params.commodityId);

      reply.send({
        commodity,
      });
    });
};
