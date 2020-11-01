const modules = new Map();

export const MODULE_ERROR_SYMBOL = Symbol.for('json-ref-escodegen/error');

export function registerModule(module, data) {
  modules.set(module, data);
}

export function getModuleSource(module) {
  return modules.get(module)?.source ?? 'UNKNOWN_SOURCE';
}

export function getModuleErrors(module) {
  return modules.get(module)?.errors;
}
