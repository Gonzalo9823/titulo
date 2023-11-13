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
  entities: isProduction ? ['build/src/infrastructures/type-orm/entities/**/*.js'] : ['src/infrastructures/type-orm/entities/**/*.ts'],
  migrations: isProduction ? ['build/src/infrastructures/type-orm/migrations/**/*.js'] : ['src/infrastructures/type-orm/migrations/**/*.ts'],
  subscribers: isProduction ? ['build/src/infrastructures/type-orm/subscribers/**/*.js'] : ['src/infrastructures/type-orm/subscribers/**/*.ts'],
});
