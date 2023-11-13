import 'reflect-metadata';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import requestLogger from '@mgcrea/fastify-request-logger';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { env } from '~/env';

import { ErrorHandler } from '~/error-handler';
import { routes } from '~/routes';

const app = fastify({
  logger: {
    level: 'debug',
    transport: {
      target: '@mgcrea/pino-pretty-compact',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  disableRequestLogging: true,
});

// Add Helmet
app.register(helmet, {
  global: true,
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "'sha256-2yQBTLGLI1sDcBILfj/o6b5ufMv6CEwPYOk3RZI/WjE='"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
    },
  },
});

// Add Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Disable Cors
app.register(cors);

// Add Logger
app.register(requestLogger);

// Add Form Body Plugin
app.register(formbody);

// Add Error Handler
app.setErrorHandler(ErrorHandler);

// Add Mikro ORM RequestContext
if (env.ORM === 'mikro-orm') {
  (async () => {
    const { RequestContext } = await import('@mikro-orm/core');
    const { getEntityManager } = await import('~/models/mikro-orm');

    app.addHook('preHandler', (_request, _reply, done) => {
      RequestContext.create(getEntityManager(), done);
    });
  })();
}

const start = async () => {
  try {
    // Add Routes
    await routes(app);

    if (env.ORM === 'type-orm') {
      const { AppDataSource } = await import('~/models/type-orm');
      await AppDataSource.initialize();
    }

    if (env.ORM === 'mikro-orm') {
      const { initMikroOrm } = await import('~/models/mikro-orm');
      await initMikroOrm();
    }

    if (env.ORM === 'pg') {
      const { pool } = await import('~/models/pg');
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
