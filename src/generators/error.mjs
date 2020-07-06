import {
  blockStatement,
  identifier,
  literal,
  newExpression,
  throwStatement,
} from '../builders.mjs';

export default function (constructor, message) {
  return blockStatement([
    throwStatement(newExpression(identifier(constructor), [literal(message)])),
  ]);
}
