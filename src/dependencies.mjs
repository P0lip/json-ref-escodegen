import { RuntimeChunk } from './modules.mjs';

export default class Dependencies {
  #childModules;
  #newModules;
  #runtimeChunk = new RuntimeChunk();

  constructor(parent = null, parentModule = null) {
    this.root = parent === null ? this : parent.root;
    this.parentModule = parentModule;
    this.#childModules = new Set();
    this.#newModules = new WeakSet();
  }

  get size() {
    return this.#childModules.size;
  }

  // todo: waiting for proper Rollup.js support (acorn)
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
    if (this.#childModules.has(module)) return module;

    if (!this.rootModules.has(module)) {
      this.#newModules.add(module);
    }

    this.#childModules.add(module);

    if (this.root !== this) {
      this.root.addModule(module);
    }

    return module;
  }

  addRuntimeDependency(member) {
    this.#runtimeChunk.addSpecifier(member);
  }

  *[Symbol.iterator]() {
    yield this.#runtimeChunk;
    yield* this.#childModules;
  }
}
