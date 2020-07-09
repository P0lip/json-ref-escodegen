export default class Dependencies {
  #childModules;
  #newModules;

  constructor(parent = null, parentModule = null) {
    this.root = parent === null ? this : parent.root;
    this.parentModule = parentModule;
    this.#childModules = new Set();
    this.#newModules = new WeakSet();
  }

  // todo: waiting for v8 8.4 to be included in Node.js
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

  addModule(module) {
    if (this.#childModules.has(module)) return;

    if (!this.rootModules.has(module)) {
      this.#newModules.add(module);
    }

    this.#childModules.add(module);

    if (this.root !== this) {
      this.root.addModule(module);
    }
  }

  addRuntimeModule(module) {
    for (const childModule of this.#childModules) {
      if (childModule.id === module.id) {
        return;
      }
    }

    this.#childModules.add(module);
  }

  *[Symbol.iterator]() {
    yield* this.#childModules;
  }
}
