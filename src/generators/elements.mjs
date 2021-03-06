import {
  arrayExpression,
  callExpression,
  literal,
  functionExpression,
} from '../builders.mjs';
import RuntimeModule from '../modules.mjs';
import { isLocalRef } from '../pointers/index.mjs';
import isPrimitive from '../utils/is-primitive.mjs';
import { CREATE_ARRAY, CREATE_ARRAY_ID } from './consts.mjs';
import generateProperties from './properties.mjs';
import generateReference from './reference.mjs';

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

  context.traverse.exit(pos);

  if ($refs !== void 0) {
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
