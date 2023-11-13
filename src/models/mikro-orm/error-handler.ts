import { ValidationError } from '@mikro-orm/core';

import { CustomError, ErrorCode, ErrorType } from '~/custom-error';

export const ErrorHandler = (error: unknown) => {
  if (error instanceof ValidationError) {
    return new CustomError(ErrorType.Validation, ErrorCode.ConstraintError);
  }

  return error;
};
