import processDocument from './document-processor.mjs';

export default async function (schema, context) {
  return await processDocument(schema, context);
}

export { default as Dependencies } from './dependencies.mjs';
export { default as ModuleRegistry } from './module-registry.mjs';
