import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { AppDataSource } from '~/models/type-orm';
import { GrowerModel } from '~/models/type-orm/entities/grower';
import { GrowerFarmModel } from '~/models/type-orm/entities/grower-farm';
import { ErrorHandler } from '~/models/type-orm/error-handler';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const GrowerTypeORMController: FastifyPluginAsync = async (fastify): Promise<void> => {
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
      const grower = new GrowerModel();

      await AppDataSource.transaction(async (transaction) => {
        try {
          const { name, lastName, email, farms } = request.body;

          grower.name = name;
          grower.lastName = lastName;
          grower.email = email;
          grower.farms = [];

          await transaction.save(grower);

          const newGrowerFarms = farms.map(({ name, address }) => {
            const growerFarm = new GrowerFarmModel();

            growerFarm.name = name;
            growerFarm.address = address;
            growerFarm.grower = grower;

            return growerFarm;
          });

          await transaction.save(newGrowerFarms);
          grower.farms.push(...newGrowerFarms);
        } catch (err) {
          throw ErrorHandler(err);
        }
      });

      reply.send({
        grower: {
          id: grower.id,
          name: grower.name,
          lastName: grower.lastName,
          email: grower.email,
          farms: grower.farms.map((farm) => ({
            id: farm.id,
            name: farm.name,
            address: farm.address,
          })),
        },
      });
    }
  );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/', { schema: { querystring: z.object({ page: z.number().int().positive().min(1).optional() }).optional() } }, async (request, reply) => {
      const [growers, count] = await AppDataSource.getRepository(GrowerModel).findAndCount({
        relations: {
          farms: true,
        },
        order: {
          createdAt: 'DESC',
          farms: {
            createdAt: 'DESC',
          },
        },
        take: request.query?.page ? 10 : undefined,
        skip: request.query?.page ? (request.query.page - 1) * 10 : undefined,
      });

      reply.send({
        growers: growers.map((grower) => ({
          id: grower.id,
          name: grower.name,
          lastName: grower.lastName,
          email: grower.email,
          farms: grower.farms.map((farm) => ({
            id: farm.id,
            name: farm.name,
            address: farm.address,
          })),
        })),
        count,
      });
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/:growerId', { schema: { params: z.object({ growerId: z.string().uuid() }) } }, async (request, reply) => {
      const grower = await AppDataSource.getRepository(GrowerModel).findOne({
        relations: {
          farms: true,
        },
        where: {
          id: request.params.growerId,
        },
        order: {
          farms: {
            createdAt: 'DESC',
          },
        },
      });

      if (!grower) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path: 'grower', type: ContextErrorType.NotFound }]);

      reply.send({
        grower: {
          id: grower.id,
          name: grower.name,
          lastName: grower.lastName,
          email: grower.email,
          farms: grower.farms.map((farm) => ({
            id: farm.id,
            name: farm.name,
            address: farm.address,
          })),
        },
      });
    });
};
