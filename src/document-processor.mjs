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
import { DefaultModule } from './modules.mjs';

export default async function processDocument(source, context) {
  const { fs } = context;

  const parentModule = DefaultModule.getFromRegistry(source, context);
  const dependencies = new Dependencies(context.dependencies, parentModule);
  dependencies.addModule(parentModule);
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
        literal(childModule.getPath(context.module)),
      ),
    );

    if (dependencies.isNew(childModule)) {
      promises.push(processDocument(childModule.source, { ...context }));
    }
  }

  promises.push(
    fs.write(
      parentModule.getPath(context.module),

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
