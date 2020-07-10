import { literal, objectExpression, property } from '../builders.mjs';
import { isLocalRef, hasRef } from '../pointers/index.mjs';
import isPrimitive from '../utils/is-primitive.mjs';
import generateElements from './elements.mjs';
import generateGetter from './getter.mjs';
import generateReference from './reference.mjs';

export default function generateProperties(obj, context) {
  const properties = [];

  const pos = context.traverse.enter();

  for (const key of context.traverse.object(obj)) {
    const value = obj[key];
    const id = literal(key);

    if (isPrimitive(value)) {
      properties.push(property('init', id, literal(value)));
    } else if (Array.isArray(value)) {
      properties.push(
        property('init', id, generateElements(value, context), true),
      );
    } else if (
      !hasRef(value) ||
      (isLocalRef(value.$ref) && !context.transformInline(value.$ref))
    ) {
      properties.push(
        property('init', id, generateProperties(value, context), true),
      );
    } else {
      properties.push(generateGetter(id, generateReference(value, context)));
    }
  }

  context.traverse.exit(pos);

  return objectExpression(properties);
}
