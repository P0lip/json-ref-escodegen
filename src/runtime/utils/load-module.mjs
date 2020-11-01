import * as runtime from './index.mjs';

export default function loadModule(availableModules) {
  const evaluatedModules = {
    'json-ref-escodegen/runtime/index.cjs': runtime,
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
