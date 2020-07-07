import fnv1a from '@sindresorhus/fnv1a';

export default class Module {
  constructor(source, context) {
    const actualSource = context.path.normalize(source);
    if (context.moduleRegistry.has(actualSource)) {
      return context.moduleRegistry.get(actualSource);
    }

    this.source = actualSource;
    this.id = String(fnv1a.bigInt(actualSource));
    context.moduleRegistry.set(actualSource, this);

    this.$refs = new Set();
  }
}
