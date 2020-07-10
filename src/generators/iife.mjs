import { callExpression, identifier, literal } from '../builders.mjs';

export default function (source) {
  return callExpression(
    callExpression(identifier('Function'), [literal(`return (${source})`)]),
    [],
  );
}
