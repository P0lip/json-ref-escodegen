import Module from './module.mjs';

export default class Dependencies {
  #childModules;
  #newModules;

  constructor(parent = null, parentModule = null) {
    this.root = parent === null ? this : parent.root;
    this.parentModule = parentModule;
    this.#childModules = new Set();
    this.#newModules = new WeakSet();
  }

  // todo: make it a private getter once node adds support for them
  get rootModules() {
    return this.root.getModules();
  }

  getModules() {
    return this.#childModules;
  }

  isNew(module) {
    return this.#newModules.has(module);
  }

  has(module) {
    return this.#childModules.has(module);
  }

  add(module) {
    if (this.#childModules.has(module)) return;

    if (!this.rootModules.has(module)) {
      this.#newModules.add(module);
    }

    this.#childModules.add(module);

    if (this.root !== this) {
      this.root.add(module);
    }
  }

  getModuleForSource(source, context) {
    return new Module(source, context);
  }

  getManifest() {
    // stub
  }

  *[Symbol.iterator]() {
    yield* this.#childModules;
  }

  static fromManifest(list) {
    const dependencies = new Dependencies(null, null);

    for (const [, source] of list) {
      dependencies.add(dependencies.getModuleForSource(source));
    }

    return dependencies;
  }
}
