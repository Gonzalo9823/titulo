import { DataSource } from 'typeorm';

import { env } from '~/env';

const isProduction = env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  logging: isProduction ? ['error'] : false,
  extra: {
    max: 15,
  },
  entities: isProduction ? ['build/src/infrastructure/type-orm/entities/**/*.js'] : ['src/infrastructure/type-orm/entities/**/*.ts'],
  migrations: isProduction ? ['build/src/infrastructure/type-orm/migrations/**/*.js'] : ['src/infrastructure/type-orm/migrations/**/*.ts'],
  subscribers: isProduction ? ['build/src/infrastructure/type-orm/subscribers/**/*.js'] : ['src/infrastructure/type-orm/subscribers/**/*.ts'],
});
