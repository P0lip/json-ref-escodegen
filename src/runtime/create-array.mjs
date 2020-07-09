const DEFAULT_DESCRIPTOR = {
  configurable: true,
  enumerable: true,
};

export default function createArray(arr, getters) {
  for (const [key, getter] of getters) {
    Object.defineProperty(arr, key, {
      ...DEFAULT_DESCRIPTOR,
      get: getter,
      set(value) {
        Object.defineProperty(arr, key, {
          ...DEFAULT_DESCRIPTOR,
          value,
          writable: true,
        });
      },
    });
  }

  return arr;
}
