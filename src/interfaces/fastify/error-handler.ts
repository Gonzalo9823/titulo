import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import createHttpError, { HttpError } from 'http-errors';
import { ZodError } from 'zod';

import { ContextErrorType, CustomError, ErrorType } from '~/apps/core/domain/custom-error';

export const ErrorHandler = async (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
  console.error(error);

  let replyError: HttpError = new createHttpError.InternalServerError();
  let context: { path?: string; type?: ContextErrorType | string }[] = [];

  if (error instanceof CustomError) {
    context = error.context;

    switch (error.type) {
      case ErrorType.NotFound:
        replyError = new createHttpError.NotFound(error.message);
        break;

      case ErrorType.BadRequest:
        replyError = new createHttpError.BadRequest(error.message);
        break;

      case ErrorType.MethodNotAllowed:
        replyError = new createHttpError.MethodNotAllowed(error.message);
        break;

      case ErrorType.Validation:
        replyError = new createHttpError.BadRequest(error.message);
        break;

      case ErrorType.InternalServerError:
        replyError = new createHttpError.InternalServerError(error.message);
        break;
    }
  }

  if (error.cause instanceof ZodError) {
    error.cause.errors.map(({ path, code }) => {
      context.push({
        path: path.join('.'),
        type: code,
      });
    });

    replyError = new createHttpError.BadRequest();
    replyError.message = 'INVALID_DATA';
  }

  reply.code(replyError.statusCode).send({
    error: replyError.name,
    message: replyError.message,
    context,
  });
};
