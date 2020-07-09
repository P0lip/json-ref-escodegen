import {
  arrayExpression,
  callExpression,
  literal,
  functionExpression,
} from '../builders.mjs';
import RuntimeModule from '../modules.mjs';
import isPrimitive from '../utils/is-primitive.mjs';
import { CREATE_ARRAY, CREATE_ARRAY_ID } from './consts.mjs';
import generateProperties from './properties.mjs';
import generateReference from './reference.mjs';

export default function generateElements(arr, context) {
  const elements = [];
  const $refs = [];
  let i = -1;

  for (const item of arr) {
    i++;

    /// skip getters?
    if (isPrimitive(item)) {
      elements.push(literal(item));
      // todo: what about symbols?
    } else if (typeof value === 'function') {
      // skip
    } else if (Array.isArray(item)) {
      elements.push(generateElements(item, context));
    } else {
      elements.push(generateProperties(item, context));
      if ('$ref' in item) {
        $refs.push(i);
      }
    }
  }

  if ($refs.length > 0) {
    context.dependencies.addRuntimeModule(
      new RuntimeModule('create-array', CREATE_ARRAY_ID),
    );

    return callExpression(CREATE_ARRAY, [
      arrayExpression(elements),
      arrayExpression(
        $refs.map(i =>
          arrayExpression([
            literal(i),
            functionExpression(null, [], generateReference(arr[i], context)),
          ]),
        ),
      ),
    ]);
  }

  return arrayExpression(elements);
}
