import { LoadStrategy, Options } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { env } from '~/env';

const MikroOrmConfig: Options<PostgreSqlDriver> = {
  clientUrl: env.DATABASE_URL,
  entities: ['build/src/infrastructures/mikro-orm/entities'],
  entitiesTs: ['src/infrastructures/mikro-orm/entities'],
  loadStrategy: LoadStrategy.JOINED,
  debug: false,
  type: 'postgresql',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'build/src/infrastructures/mikro-orm/migrations',
    pathTs: 'src/infrastructures/mikro-orm/migrations',
    transactional: true,
    dropTables: true,
    safe: false,
    snapshot: false,
    disableForeignKeys: env.NODE_ENV !== 'production',
    emit: 'ts',
  },
};

export default MikroOrmConfig;
