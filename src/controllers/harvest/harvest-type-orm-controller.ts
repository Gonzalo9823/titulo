import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { AppDataSource } from '~/models/type-orm';
import { ClientModel } from '~/models/type-orm/entities/client';
import { CommodityModel } from '~/models/type-orm/entities/commodity';
import { GrowerModel } from '~/models/type-orm/entities/grower';
import { GrowerFarmModel } from '~/models/type-orm/entities/grower-farm';
import { HarvestModel } from '~/models/type-orm/entities/harvest';
import { VarietyModel } from '~/models/type-orm/entities/variety';
import { ErrorHandler } from '~/models/type-orm/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const HarvestTypeORMController: FastifyPluginAsync = async (fastify): Promise<void> => {
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

      try {
        const grower = await AppDataSource.getRepository(GrowerModel).findOneOrFail({ where: { id: growerId } });
        const farm = await AppDataSource.getRepository(GrowerFarmModel).findOneOrFail({ where: { id: farmId } });
        const client = await AppDataSource.getRepository(ClientModel).findOneOrFail({ where: { id: clientId } });
        const commodity = await AppDataSource.getRepository(CommodityModel).findOneOrFail({ where: { id: commodityId } });
        const variety = await AppDataSource.getRepository(VarietyModel).findOneOrFail({ where: { id: varietyId } });

        harvest.grower = grower;
        harvest.farm = farm;
        harvest.client = client;
        harvest.commodity = commodity;
        harvest.variety = variety;

        await AppDataSource.getRepository(HarvestModel).save(harvest);
      } catch (err) {
        throw ErrorHandler(err);
      }

      reply.send({
        harvest: {
          id: harvest.id,
          grower: {
            id: harvest.grower.id,
            name: harvest.grower.name,
            lastName: harvest.grower.lastName,
            email: harvest.grower.email,
          },
          farm: {
            id: harvest.farm.id,
            name: harvest.farm.name,
            address: harvest.farm.address,
          },
          client: {
            id: harvest.client.id,
            name: harvest.client.name,
            lastName: harvest.client.lastName,
            email: harvest.client.email,
          },
          commodity: {
            id: harvest.commodity.id,
            name: harvest.commodity.name,
          },
          variety: {
            id: harvest.variety.id,
            name: harvest.variety.name,
          },
          createdAt: harvest.createdAt,
        },
      });
    }
  );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const [harvests, count] = await AppDataSource.getRepository(HarvestModel).findAndCount({
        relations: {
          grower: true,
          farm: true,
          client: true,
          commodity: true,
          variety: true,
        },
        order: {
          createdAt: 'DESC',
        },
        take: request.query?.page ? 10 : undefined,
        skip: request.query?.page ? (request.query?.page - 1) * 10 : undefined,
      });

      reply.send({
        harvests: harvests.map((harvest) => ({
          id: harvest.id,
          grower: {
            id: harvest.grower.id,
            name: harvest.grower.name,
            lastName: harvest.grower.lastName,
            email: harvest.grower.email,
          },
          farm: {
            id: harvest.farm.id,
            name: harvest.farm.name,
            address: harvest.farm.address,
          },
          client: {
            id: harvest.client.id,
            name: harvest.client.name,
            lastName: harvest.client.lastName,
            email: harvest.client.email,
          },
          commodity: {
            id: harvest.commodity.id,
            name: harvest.commodity.name,
          },
          variety: {
            id: harvest.variety.id,
            name: harvest.variety.name,
          },
          createdAt: harvest.createdAt,
        })),
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:harvestId', { schema: { params: z.object({ harvestId: z.string().uuid() }) } }, async (request, reply) => {
      const harvest = await AppDataSource.getRepository(HarvestModel).findOne({
        relations: {
          grower: true,
          farm: true,
          client: true,
          commodity: true,
          variety: true,
        },
        where: {
          id: request.params.harvestId,
        },
      });

      if (!harvest) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'harvest', type: ContextErrorType.NotFound }]);

      reply.send({
        harvest: {
          id: harvest.id,
          grower: {
            id: harvest.grower.id,
            name: harvest.grower.name,
            lastName: harvest.grower.lastName,
            email: harvest.grower.email,
          },
          farm: {
            id: harvest.farm.id,
            name: harvest.farm.name,
            address: harvest.farm.address,
          },
          client: {
            id: harvest.client.id,
            name: harvest.client.name,
            lastName: harvest.client.lastName,
            email: harvest.client.email,
          },
          commodity: {
            id: harvest.commodity.id,
            name: harvest.commodity.name,
          },
          variety: {
            id: harvest.variety.id,
            name: harvest.variety.name,
          },
          createdAt: harvest.createdAt,
        },
      });
    });
};
