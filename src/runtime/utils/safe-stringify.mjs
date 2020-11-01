import isGetter from '../../utils/is-getter.mjs';
import { pathToPointer } from '../../pointers/index.mjs';

const CONTEXT_KEY = Symbol.for('json-ref-escodegen/safe-stringify');

export default function (document) {
  const context = {
    depth: -1,
    keys: [''],
    path: [],
  };

  return trap(document, context);
}

function trap(target, context) {
  return new Proxy(target, {
    [CONTEXT_KEY]: {
      depth: context.depth + 1,
      keys: context.keys,
      path: context.path,
    },
    get,
  });
}

function get(target, key) {
  const value = isGetter(target, key)
    ? safeGet.call(this, target, key)
    : target[key];

  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const { depth, keys, path } = this[CONTEXT_KEY];
  const index = path.indexOf(target);
  const lastIndex = path.lastIndexOf(target);

  path.length = depth;
  keys.length = path.length;
  path.push(target);
  keys.push(key);

  if (index !== lastIndex) {
    return {
      $ref: pathToPointer(keys),
    };
  }

  return trap(value, this[CONTEXT_KEY]);
}

function safeGet(target, key) {
  try {
    return target[key]; // Reflect.get with custom target?
  } catch (ex) {
    if (ex instanceof RangeError) {
      const { keys } = this[CONTEXT_KEY];
      return {
        get $ref() {
          return pathToPointer(keys);
        },
      };
    }

    return null;
  }
}
