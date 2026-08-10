import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Returns the user in the Execution Context
 * This doesn't return a type, because multiple modules handle this with different types
 * @param context The current execution context
 */
export function getUserFromContext(context: ExecutionContext) {
  const gqlCtx = GqlExecutionContext.create(context);
  return gqlCtx.getContext().req.user;
}

/**
 * Returns the user in the Execution Context when it use the HttpContext
 * This doesn't return a type, because multiple modules handle this with different types
 * @param context The current execution context
 */
export function getUserFromHttpContext(context: ExecutionContext) {
  const httpCtx = context.switchToHttp();
  return httpCtx.getRequest().user;
}

/**
 * Returns the arguments passed to the GraphQL request
 * @param context The current execution context
 */
export function getArgumentsFromContext(context: ExecutionContext) {
  const gqlCtx = GqlExecutionContext.create(context);
  return gqlCtx.getArgs();
}

/**
 * Returns the current response based on the Execution Context
 * @param context The current execution context
 */
export function getResponseFromContext(context: ExecutionContext) {
  const gqlCtx = GqlExecutionContext.create(context);
  return gqlCtx.getContext().response;
}

/**
 * Returns the current response based on the Execution Context
 * @param context The current execution context
 */
export function getResponseFromHttpContext(context: ExecutionContext) {
  const httpCtx = context.switchToHttp();
  return httpCtx.getResponse();
}

/**
 * Returns the current Request based on the Execution Context
 * @param context The current execution context
 */
export function getRequestFromContext(context: ExecutionContext) {
  const gqlCtx = GqlExecutionContext.create(context);
  return gqlCtx.getContext() ? gqlCtx.getContext().req : {};
}

/**
 * Returns the current Request based on the Execution Context
 * @param context The current execution context
 */
export function getRequestFromHttpContext(context: ExecutionContext) {
  const httpCtx = context.switchToHttp();
  return httpCtx.getRequest();
}
