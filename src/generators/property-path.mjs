import { literal, memberExpression } from '../builders.mjs';

export default function (root, path) {
  let expression = root;

  // todo: !(xyz in foo)? throw
  for (const segment of path) {
    expression = memberExpression(expression, literal(segment), true);
  }

  return expression;
}
