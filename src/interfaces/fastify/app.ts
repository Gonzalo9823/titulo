import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import requestLogger from '@mgcrea/fastify-request-logger';
import { RequestContext } from '@mikro-orm/core';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { getEntityManager } from '~/infrastructures/mikro-orm';

import { ErrorHandler } from '~/interfaces/fastify/error-handler';
import { routes } from '~/interfaces/fastify/routes';

import { env } from '~/env';

const app = fastify({
  logger: { transport: { target: '@mgcrea/pino-pretty-compact', options: { colorize: true } } },
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
  app.addHook('preHandler', (_request, _reply, done) => {
    RequestContext.create(getEntityManager(), done);
  });
}

// Add Routes
routes(app);

export { app };
