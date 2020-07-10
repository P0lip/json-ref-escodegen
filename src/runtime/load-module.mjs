import createArray from './create-array.mjs';

export default function loadModule(availableModules) {
  const evaluatedModules = {
    'json-ref-escodegen/runtime/create-array.cjs': createArray,
    'json-ref-escodegen/runtime/load-module.cjs': loadModule,
  };

  return function require(path) {
    if (path in evaluatedModules) {
      return evaluatedModules[path];
    } else if (path in availableModules) {
      const module = {
        get exports() {
          return evaluatedModules[path];
        },
        set exports(val) {
          evaluatedModules[path] = val;
        },
      };

      Function('require, module', availableModules[path])(require, module);
      return evaluatedModules[path];
    } else {
      throw new Error(`${path} does not exist`);
    }
  };
}
