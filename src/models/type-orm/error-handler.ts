import { QueryFailedError } from 'typeorm';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

export const ErrorHandler = (error: unknown) => {
  if (error instanceof QueryFailedError) {
    const errorCode = error.driverError.code;

    if (errorCode === PG_UNIQUE_CONSTRAINT_VIOLATION) {
      return new CustomError(ErrorType.Validation, ErrorCode.ConstraintError, [{ type: ContextErrorType.Unique, path: error.driverError.detail }]);
    }
  }

  return error;
};
