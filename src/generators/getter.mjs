import { functionExpression, property } from '../builders.mjs';

export default function (id, body) {
  return property('get', id, functionExpression(null, [], body), true);
}
