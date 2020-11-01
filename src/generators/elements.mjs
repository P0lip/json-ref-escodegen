import {
  arrayExpression,
  callExpression,
  literal,
  functionExpression,
  identifier,
} from '../builders.mjs';
import { isLocalRef } from '../pointers/index.mjs';
import createArray from '../runtime/utils/create-array.mjs';
import isPrimitive from '../utils/is-primitive.mjs';
import generateProperties from './properties.mjs';
import generateReference from './reference.mjs';

const CREATE_ARRAY = identifier(createArray.name);

export default function generateElements(arr, context) {
  const elements = [];
  let $refs;

  const pos = context.traverse.enter();

  for (const item of context.traverse.array(arr)) {
    if (isPrimitive(item)) {
      elements.push(literal(item));
    } else if (Array.isArray(item)) {
      elements.push(generateElements(item, context));
    } else {
      elements.push(generateProperties(item, context));

      if (
        '$ref' in item &&
        (!isLocalRef(item.$ref) || context.transformInline(item.$ref))
      ) {
        const key = context.traverse.path[context.traverse.path.length - 1];
        if ($refs === void 0) {
          $refs = [key];
        } else {
          $refs.push(key);
        }
      }
    }
  }

  if ($refs !== void 0) {
    context.dependencies.addRuntimeDependency(createArray.name);

    const tree = callExpression(CREATE_ARRAY, [
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

    context.traverse.exit(pos);
    return tree;
  }

  context.traverse.exit(pos);

  return arrayExpression(elements);
}
