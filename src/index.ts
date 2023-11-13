import 'reflect-metadata';

import { AppDataSource } from '~/infrastructures/type-orm';

import { app } from '~/interfaces/fastify/app';

import { env } from '~/env';

const start = async () => {
  try {
    await AppDataSource.initialize();
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 App Running on PORT ${env.PORT}`);
  } catch (err) {
    console.log(`There was an error ${err}`);
    process.exit(1);
  }
};

start();
