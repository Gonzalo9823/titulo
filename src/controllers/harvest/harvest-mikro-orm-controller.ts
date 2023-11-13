import { wrap } from '@mikro-orm/core';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { getEntityManager } from '~/models/mikro-orm';
import { ClientModel } from '~/models/mikro-orm/entities/client';
import { CommodityModel } from '~/models/mikro-orm/entities/commodity';
import { GrowerModel } from '~/models/mikro-orm/entities/grower';
import { GrowerFarmModel } from '~/models/mikro-orm/entities/grower-farm';
import { HarvestModel } from '~/models/mikro-orm/entities/harvest';
import { VarietyModel } from '~/models/mikro-orm/entities/variety';
import { ErrorHandler } from '~/models/mikro-orm/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const HarvestMikroORMController: FastifyPluginAsync = async (fastify): Promise<void> => {
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
      const harvest = new HarvestModel();

      const { growerId, farmId, clientId, commodityId, varietyId } = request.body;

      const grower = await getEntityManager().findOneOrFail(GrowerModel, { id: growerId });
      const farm = await getEntityManager().findOneOrFail(GrowerFarmModel, { id: farmId });
      const client = await getEntityManager().findOneOrFail(ClientModel, { id: clientId });
      const commodity = await getEntityManager().findOneOrFail(CommodityModel, { id: commodityId });
      const variety = await getEntityManager().findOneOrFail(VarietyModel, { id: varietyId });

      try {
        harvest.grower = wrap(grower).toReference();
        harvest.farm = wrap(farm).toReference();
        harvest.client = wrap(client).toReference();
        harvest.commodity = wrap(commodity).toReference();
        harvest.variety = wrap(variety).toReference();

        await getEntityManager().persistAndFlush(harvest);
      } catch (err) {
        throw ErrorHandler(err);
      }

      reply.send({
        harvest: {
          id: harvest.id,
          grower: {
            id: grower.id,
            name: grower.name,
            lastName: grower.lastName,
            email: grower.email,
          },
          farm: {
            id: farm.id,
            name: farm.name,
            address: farm.address,
          },
          client: {
            id: client.id,
            name: client.name,
            lastName: client.lastName,
            email: client.email,
          },
          commodity: {
            id: commodity.id,
            name: commodity.name,
          },
          variety: {
            id: variety.id,
            name: variety.name,
          },
          createdAt: harvest.createdAt,
        },
      });
    }
  );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const [harvests, count] = await getEntityManager().findAndCount(
        HarvestModel,
        {},
        {
          populate: ['grower', 'farm', 'client', 'commodity', 'variety'],
          orderBy: {
            createdAt: 'DESC',
          },
          limit: request.query?.page ? 10 : undefined,
          offset: request.query?.page ? (request.query.page - 1) * 10 : undefined,
        }
      );

      reply.send({
        harvests: harvests.map((harvest) => ({
          id: harvest.id,
          grower: {
            id: harvest.grower.$.id,
            name: harvest.grower.$.name,
            lastName: harvest.grower.$.lastName,
            email: harvest.grower.$.email,
          },
          farm: {
            id: harvest.farm.$.id,
            name: harvest.farm.$.name,
            address: harvest.farm.$.address,
          },
          client: {
            id: harvest.client.$.id,
            name: harvest.client.$.name,
            lastName: harvest.client.$.lastName,
            email: harvest.client.$.email,
          },
          commodity: {
            id: harvest.commodity.$.id,
            name: harvest.commodity.$.name,
          },
          variety: {
            id: harvest.variety.$.id,
            name: harvest.variety.$.name,
          },
          createdAt: harvest.createdAt,
        })),
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:harvestId', { schema: { params: z.object({ harvestId: z.string().uuid() }) } }, async (request, reply) => {
      const harvest = await getEntityManager().findOne(
        HarvestModel,
        {
          id: request.params.harvestId,
        },
        {
          populate: ['grower', 'farm', 'client', 'commodity', 'variety'],
        }
      );

      if (!harvest) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'harvest', type: ContextErrorType.NotFound }]);

      reply.send({
        harvest: {
          id: harvest.id,
          grower: {
            id: harvest.grower.$.id,
            name: harvest.grower.$.name,
            lastName: harvest.grower.$.lastName,
            email: harvest.grower.$.email,
          },
          farm: {
            id: harvest.farm.$.id,
            name: harvest.farm.$.name,
            address: harvest.farm.$.address,
          },
          client: {
            id: harvest.client.$.id,
            name: harvest.client.$.name,
            lastName: harvest.client.$.lastName,
            email: harvest.client.$.email,
          },
          commodity: {
            id: harvest.commodity.$.id,
            name: harvest.commodity.$.name,
          },
          variety: {
            id: harvest.variety.$.id,
            name: harvest.variety.$.name,
          },
          createdAt: harvest.createdAt,
        },
      });
    });
};
