import astring from 'astring';

import {
  variableDeclaration,
  variableDeclarator,
  program,
  literal,
} from './builders.mjs';
import { MODULE_ROOT_IDENTIFIER } from './generators/consts.mjs';
import {
  generateElements,
  generateExport,
  generateImport,
  generateProperties,
  safeIdentifier,
} from './generators/index.mjs';
import Dependencies from './dependencies.mjs';
import Module from './module.mjs';

export default async function processDocument(source, context) {
  const { fs } = context;

  const parentModule = new Module(source, context);
  const dependencies = new Dependencies(context.dependencies, parentModule);
  dependencies.add(parentModule);
  context.dependencies = dependencies;

  const data = await fs.read(parentModule.source); // todo: on error export some deep proxy or what?
  const imports = [];
  const promises = [];

  const generatedTree = Array.isArray(data)
    ? generateElements(data, context)
    : generateProperties(data, context);

  for (const childModule of dependencies) {
    if (childModule === parentModule) continue;

    imports.push(
      generateImport(
        context.module,
        safeIdentifier(childModule.id),
        literal(sourceIdToModuleSource(context.module, childModule.id)),
      ),
    );

    if (dependencies.isNew(childModule)) {
      promises.push(processDocument(childModule.source, { ...context }));
    }
  }

  promises.push(
    fs.write(
      sourceIdToModuleSource(context.module, parentModule.id),

      astring.generate(
        program([
          ...imports,

          variableDeclaration('const', [
            variableDeclarator(MODULE_ROOT_IDENTIFIER, generatedTree),
          ]),

          generateExport(context.module, MODULE_ROOT_IDENTIFIER),
        ]),
      ),
    ),
  );

  await Promise.allSettled(promises);

  return parentModule;
}

const sourceIdToModuleSource = (module, sourceId) =>
  `./${sourceId}.${module === 'esm' ? 'm' : ''}js`;
