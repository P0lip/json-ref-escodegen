import processDocument from './document-processor.mjs';
import ModuleRegistry from './module-registry.mjs';

export default async function (schema, context) {
  const internalContext = {
    ...context,
    moduleRegistry: new ModuleRegistry(), // todo: get rid of it
  };

  return await processDocument(schema, internalContext);
}

export { default as Dependencies } from './dependencies.mjs';
export { default as Traverse } from './traverse.mjs';
