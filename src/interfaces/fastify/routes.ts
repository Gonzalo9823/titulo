import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { ClientController } from '~/apps/client/interface/client-controller';
import { CommodityController } from '~/apps/commodity/interface/commodity-controller';
import { GrowerController } from '~/apps/grower/interface/grower-controller';
import { HarvestController } from '~/apps/harvest/interface/harvest-controller';

const _routes: [string, FastifyPluginAsync][] = [
  ['/commodities', CommodityController],
  ['/growers', GrowerController],
  ['/clients', ClientController],
  ['/harvests', HarvestController],
];

export const routes = (app: FastifyInstance): void => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.register(controller, {
      prefix: `/v1${url}`,
    });
  });
};
