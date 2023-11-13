import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import requestLogger from '@mgcrea/fastify-request-logger';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { ErrorHandler } from '~/interfaces/fastify/error-handler';
import { routes } from '~/interfaces/fastify/routes';

import { env } from '~/env';

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
    const { getEntityManager } = await import('~/infrastructures/mikro-orm');

    app.addHook('preHandler', (_request, _reply, done) => {
      RequestContext.create(getEntityManager(), done);
    });
  })();
}

// Add Routes
routes(app);

export { app };
