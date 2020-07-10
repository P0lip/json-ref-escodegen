import isSerializable from './utils/is-serializable.mjs';
import isGetter from './utils/is-getter.mjs';

export default class Traverse {
  constructor(opts) {
    this.skipGetters = opts.skipGetters;
    this.path = [];
  }

  enter() {
    return this.path.push('');
  }

  *array(arr) {
    let i = 0;

    for (const item of arr) {
      if (this.skipGetters && isGetter(arr, i)) {
        continue;
      }

      this.path[this.path.length - 1] = String(i);

      if (isSerializable(item)) {
        yield item;
      }

      i++;
    }
  }

  *object(obj) {
    for (const key of Object.keys(obj)) {
      if (this.skipGetters && isGetter(obj, key)) {
        continue;
      }

      this.path[this.path.length - 1] = key;
      const value = obj[key];

      if (isSerializable(value)) {
        yield key;
      }
    }
  }

  exit(pos) {
    this.path.length = pos - 1;
  }
}
