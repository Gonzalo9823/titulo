import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { env } from '~/env';

export const routes = async (app: FastifyInstance): Promise<void> => {
  const _routes = await (async (): Promise<[string, FastifyPluginAsync][]> => {
    if (env.ORM === 'mikro-orm') {
      const { ClientMikroORMController } = await import('~/controllers/client/client-mikro-orm-controller');
      const { CommodityMikroORMController } = await import('~/controllers/commodity/commodity-mikro-orm-controller');
      const { GrowerMikroORMController } = await import('~/controllers/grower/grower-mikro-orm-controller');
      const { HarvestMikroORMController } = await import('~/controllers/harvest/harvest-mikro-orm-controller');

      return [
        ['/clients', ClientMikroORMController],
        ['/commodities', CommodityMikroORMController],
        ['/growers', GrowerMikroORMController],
        ['/harvests', HarvestMikroORMController],
      ];
    }

    if (env.ORM === 'type-orm') {
      const { ClientTypeORMController } = await import('~/controllers/client/client-type-orm-controller');
      const { CommodityTypeORMController } = await import('~/controllers/commodity/commodity-type-orm-controller');
      const { GrowerTypeORMController } = await import('~/controllers/grower/grower-type-orm-controller');
      const { HarvestTypeORMController } = await import('~/controllers/harvest/harvest-type-orm-controller');

      return [
        ['/clients', ClientTypeORMController],
        ['/commodities', CommodityTypeORMController],
        ['/growers', GrowerTypeORMController],
        ['/harvests', HarvestTypeORMController],
      ];
    }

    if (env.ORM === 'pg') {
      const { ClientPGController } = await import('~/controllers/client/client-pg-controller');
      const { CommodityPGController } = await import('~/controllers/commodity/commodity-pg-controller');
      const { GrowerPGController } = await import('~/controllers/grower/grower-pg-controller');
      const { HarvestPGController } = await import('~/controllers/harvest/harvest-pg-controller');

      return [
        ['/clients', ClientPGController],
        ['/commodities', CommodityPGController],
        ['/growers', GrowerPGController],
        ['/harvests', HarvestPGController],
      ];
    }

    return [];
  })();

  _routes.forEach((route) => {
    const [url, controller] = route;
    app.register(controller, {
      prefix: `/v1${url}`,
    });
  });
};
