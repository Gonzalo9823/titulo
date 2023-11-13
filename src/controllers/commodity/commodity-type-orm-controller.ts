import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { AppDataSource } from '~/models/type-orm';
import { CommodityModel } from '~/models/type-orm/entities/commodity';
import { VarietyModel } from '~/models/type-orm/entities/variety';
import { ErrorHandler } from '~/models/type-orm/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const CommodityTypeORMController: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      { schema: { body: z.object({ name: z.string().trim().min(1), varieties: z.array(z.string().trim().min(1)) }) } },
      async (request, reply) => {
        const commodity = new CommodityModel();

        await AppDataSource.transaction(async (transaction) => {
          try {
            const { name, varieties } = request.body;

            commodity.name = name;
            commodity.varieties = [];

            await transaction.save(commodity);

            const newVarieties = varieties.map((name) => {
              const variety = new VarietyModel();

              variety.name = name;
              variety.commodity = commodity;

              return variety;
            });

            await transaction.save(newVarieties);
            commodity.varieties.push(...newVarieties);
          } catch (err) {
            throw ErrorHandler(err);
          }
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
      const [commodities, count] = await AppDataSource.getRepository(CommodityModel).findAndCount({
        relations: {
          varieties: true,
        },
        order: {
          createdAt: 'DESC',
          varieties: {
            createdAt: 'DESC',
          },
        },
        take: request.query?.page ? 10 : undefined,
        skip: request.query?.page ? (request.query.page - 1) * 10 : undefined,
      });

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
      const commodity = await AppDataSource.getRepository(CommodityModel).findOne({
        relations: {
          varieties: true,
        },
        where: {
          id: request.params.commodityId,
        },
        order: {
          varieties: {
            createdAt: 'DESC',
          },
        },
      });

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
