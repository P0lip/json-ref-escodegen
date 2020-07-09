import fnv1a from '@sindresorhus/fnv1a';

const getExtensionForModule = module => `.${module === 'esm' ? 'm' : 'c'}js`;

export class DefaultModule {
  constructor(source) {
    this.source = source;
    this.id = String(fnv1a.bigInt(source));

    this.retainers = new Set();
  }

  getPath(module) {
    return `./${this.id}${getExtensionForModule(module)}`;
  }

  static getFromRegistry(source, context) {
    const existingModule = context.moduleRegistry.get(source);
    if (existingModule !== void 0) {
      return existingModule;
    }

    const module = new DefaultModule(source);
    context.moduleRegistry.set(source, module);
    return module;
  }
}

export default class RuntimeModule {
  constructor(member, id) {
    this.source = `json-ref-escodegen/runtime/${member}`;
    this.id = id;
  }

  getPath(module) {
    return `${this.source}${getExtensionForModule(module)}`;
  }
}
