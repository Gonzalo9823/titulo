import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    ORM: z.union([z.literal('type-orm'), z.literal('mikro-orm')]),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
