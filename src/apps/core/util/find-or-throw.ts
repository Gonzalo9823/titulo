import { ContextErrorType, CustomError, ErrorCode, ErrorType } from '~/apps/core/domain/custom-error';

export const findOrThrow = <T>(arr: T[], predicate: (value: T, index: number, obj: T[]) => boolean, path: string): T => {
  const result = arr.find(predicate);

  if (!result) {
    throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ path, type: ContextErrorType.NotFound }]);
  }

  return result;
};
