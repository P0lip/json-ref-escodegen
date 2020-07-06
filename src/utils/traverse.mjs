import isPrimitive from './is-primitive.mjs';
import isGetter from './is-getter.mjs';

export default function (obj, path = []) {
  path.length = 0;
  return traverse(obj, path, {});
}

function* traverse(obj, path, opts) {
  for (const key of Object.keys(obj)) {
    if (opts.skipGetters && isGetter(obj, key)) {
      continue;
    }

    // const l = path.push(key);
    const value = obj[key];

    if (isPrimitive(value) || typeof value === 'object') {
      // todo: symbols?
      yield key;
    }

    // path.length = l;
  }
}
