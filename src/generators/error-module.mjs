import {
  callExpression,
  identifier,
  literal,
  newExpression,
} from '../builders.mjs';
import { ReadError, createErrorStub } from '../runtime/index.mjs';

const CREATE_ERROR_STUB = identifier(createErrorStub.name);
const READ_ERROR = identifier(ReadError.name);

export default function generateErrorModule(message, context) {
  context.dependencies.addRuntimeDependency(ReadError.name);
  context.dependencies.addRuntimeDependency(createErrorStub.name);

  return callExpression(CREATE_ERROR_STUB, [
    newExpression(READ_ERROR, [literal(message)]),
  ]);
}
