import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver, EntityManager, AbstractSqlDriver, AbstractSqlConnection, AbstractSqlPlatform } from '@mikro-orm/postgresql';

import MikroOrmConfig from '~/models/mikro-orm/mikro-orm.config';

import { CustomError, ErrorCode, ErrorType } from '~/custom-error';

let em: EntityManager<AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>> | undefined;

export const initMikroOrm = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(MikroOrmConfig);

  em = orm.em;

  return orm;
};

export const getEntityManager = (): EntityManager<AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>> => {
  if (!em) {
    throw new CustomError(ErrorType.InternalServerError, ErrorCode.DatabaseConnection);
  }

  return em;
};
