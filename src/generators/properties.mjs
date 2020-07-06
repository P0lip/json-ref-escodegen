import { literal, objectExpression, property } from '../builders.mjs';
import traverse from '../utils/traverse.mjs';
import isPrimitive from '../utils/is-primitive.mjs';
import generateElements from './elements.mjs';
import generateGetter from './getter.mjs';
import generateReference from './reference.mjs';

export default function generateProperties(obj, context) {
  const properties = [];

  for (const key of traverse(obj)) {
    const value = obj[key];
    const id = literal(key);

    if (isPrimitive(value)) {
      properties.push(property('init', id, literal(value)));
    } else if (Array.isArray(value)) {
      properties.push(
        property('init', id, generateElements(value, context), true),
      );
    } else if (!('$ref' in value)) {
      properties.push(
        property('init', id, generateProperties(value, context), true),
      );
    } else {
      properties.push(generateGetter(id, generateReference(value, context)));
    }
  }

  return objectExpression(properties);
}
