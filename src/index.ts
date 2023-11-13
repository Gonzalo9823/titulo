import 'reflect-metadata';

import { app } from '~/interfaces/fastify/app';

import { env } from '~/env';

const start = async () => {
  try {
    if (env.ORM === 'type-orm') {
      const { AppDataSource } = await import('~/infrastructures/type-orm');
      await AppDataSource.initialize();
    }

    if (env.ORM === 'mikro-orm') {
      const { initMikroOrm } = await import('~/infrastructures/mikro-orm');
      await initMikroOrm();
    }

    if (env.ORM === 'pg') {
      const { pool } = await import('~/infrastructures/pg');
      await pool.connect();
    }

    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 App Running on PORT ${env.PORT}`);
  } catch (err) {
    console.log(`There was an error ${err}`);
    process.exit(1);
  }
};

start();
