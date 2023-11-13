import { wrap } from '@mikro-orm/core';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { getEntityManager } from '~/models/mikro-orm';
import { CommodityModel } from '~/models/mikro-orm/entities/commodity';
import { VarietyModel } from '~/models/mikro-orm/entities/variety';
import { ErrorHandler } from '~/models/mikro-orm/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const CommodityMikroORMController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      { schema: { body: z.object({ name: z.string().trim().min(1), varieties: z.array(z.string().trim().min(1)) }) } },
      async (request, reply) => {
        const commodity = new CommodityModel();

        commodity.name = request.body.name;
        getEntityManager().persist(commodity);

        request.body.varieties.forEach((name) => {
          const variety = new VarietyModel();

          variety.name = name;
          variety.commodity = wrap(commodity).toReference();

          getEntityManager().persist(variety);
          commodity.varieties.add(variety);
        });

        await getEntityManager()
          .flush()
          .catch((err) => {
            throw ErrorHandler(err);
          });

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
      }
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const [commodities, count] = await getEntityManager().findAndCount(
        CommodityModel,
        {},
        {
          populate: ['varieties'],
          orderBy: {
            createdAt: 'DESC',
            varieties: {
              createdAt: 'DESC',
            },
          },
          limit: request.query?.page ? 10 : undefined,
          offset: request.query?.page ? (request.query.page - 1) * 10 : undefined,
        }
      );

      reply.send({
        commodities: commodities.map((commodity) => ({
          id: commodity.id,
          name: commodity.name,
          varieties: commodity.varieties.map((variety) => ({
            id: variety.id,
            name: variety.name,
          })),
        })),
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:commodityId', { schema: { params: z.object({ commodityId: z.string().uuid() }) } }, async (request, reply) => {
      const commodity = await getEntityManager().findOne(
        CommodityModel,
        {
          id: request.params.commodityId,
        },
        {
          populate: ['varieties'],
          orderBy: {
            varieties: {
              createdAt: 'DESC',
            },
          },
        }
      );

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
