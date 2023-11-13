import { DatabaseError } from 'pg';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const ErrorHandler = (error: unknown) => {
  if (error instanceof DatabaseError) {
    return new CustomError(ErrorType.Validation, ErrorCode.ConstraintError, [{ type: ContextErrorType.Unique, path: error.message }]);
  }

  return error;
};
