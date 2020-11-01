import fnv1a from '@sindresorhus/fnv1a';

const getExtensionForModule = module => `.${module === 'esm' ? 'm' : 'c'}js`;

export class File {
  constructor(source) {
    this.source = source;
    this.id = String(fnv1a.bigInt(source));
    this.errors = [];

    this.retainers = new Map();
    this.getters = new Set();
  }

  addGetterPath(path) {
    this.getters.add(path);
  }

  addRetainer(module, pointer, path) {
    const retainer = this.retainers.get(module);
    if (retainer !== void 0) {
      retainer.push({
        pointer,
        propertyPath: path,
      });
    } else {
      this.retainers.set(module, [
        {
          pointer,
          propertyPath: path,
        },
      ]);
    }
  }

  addInlineRetainer(pointer, path) {
    this.addRetainer(this, pointer, path);
  }

  get specifier() {
    return this.id;
  }

  getPath(module) {
    return `./${this.id}${getExtensionForModule(module)}`;
  }

  static getFromRegistry(source, context) {
    const existingModule = context.moduleRegistry.get(source);
    if (existingModule !== void 0) {
      return existingModule;
    }

    const module = new File(source);
    context.moduleRegistry.set(source, module);
    return module;
  }
}

export class RuntimeChunk {
  constructor() {
    this.source = `json-ref-escodegen/runtime/index`;
    this.id = 'RUNTIME_CHUNK';
    this.specifiers = [];
  }

  addSpecifier(member) {
    if (!this.specifiers.includes(member)) {
      this.specifiers.push(member);
    }
  }

  getPath(module) {
    return `${this.source}${getExtensionForModule(module)}`;
  }
}
