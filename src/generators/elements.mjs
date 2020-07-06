import {
  arrayExpression,
  callExpression,
  literal,
  property,
  objectExpression,
  identifier,
  functionExpression,
} from '../builders.mjs';
import isPrimitive from '../utils/is-primitive.mjs';
import { DEFAULT_DESCRIPTORS, OBJECT_DEFINE_PROPERTIES } from './consts.mjs';
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
    return callExpression(OBJECT_DEFINE_PROPERTIES, [
      arrayExpression(elements),
      objectExpression(
        $refs.map(i =>
          property(
            'init',
            literal(i),
            objectExpression([
              ...DEFAULT_DESCRIPTORS,
              property(
                'method',
                identifier('get'), // todo: what about set so the value can be changed?
                functionExpression(
                  null,
                  [],
                  generateReference(arr[i], context),
                ),
              ),
            ]),
          ),
        ),
      ),
    ]);
  }

  return arrayExpression(elements);
}
