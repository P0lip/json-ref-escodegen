import astring from 'astring';

import {
  variableDeclaration,
  variableDeclarator,
  program,
} from './builders.mjs';
import { MODULE_ROOT, MODULE_ROOT_ID } from './generators/consts.mjs';
import {
  generateElements,
  generateExport,
  generateIIFE,
  generateDefaultImport,
  generateProperties,
  generateErrorModule,
  generateMembersImport,
  generateErrorCollector,
} from './generators/index.mjs';
import Dependencies from './dependencies.mjs';
import { File } from './modules.mjs';
import { WriteError } from './runtime/errors/fs.mjs';

export default async function processDocument(source, context) {
  const { fs } = context;

  const parentModule = File.getFromRegistry(source, context);
  const dependencies = new Dependencies(context.dependencies, parentModule);
  dependencies.addModule(parentModule);
  context.dependencies = dependencies;

  const imports = [];
  const promises = [];

  let generatedTree;
  try {
    const data = await fs.read(parentModule.source);

    generatedTree =
      data !== null && context.transformExternal(parentModule.source)
        ? Array.isArray(data)
          ? generateElements(data, context)
          : generateProperties(data, context)
        : generateIIFE(String(data));
  } catch (ex) {
    generatedTree = generateErrorModule(
      ex?.message ?? 'Unknown read error',
      context,
    );
  }

  const errors = generateErrorCollector(source, parentModule.getters, context);

  for (const childModule of dependencies) {
    if (childModule === parentModule) continue;

    const source = childModule.getPath(context.module);

    if ('specifier' in childModule) {
      imports.push(
        generateDefaultImport(context.module, childModule.id, source),
      );
    } else if ('specifiers' in childModule) {
      imports.push(
        generateMembersImport(context.module, childModule.specifiers, source),
      );
    }

    if (dependencies.isNew(childModule)) {
      promises.push(processDocument(childModule.source, { ...context }));
    }
  }

  promises.push(
    fs
      .write(
        parentModule.getPath(context.module),

        astring.generate(
          program([
            ...imports,

            variableDeclaration('const', [
              variableDeclarator(MODULE_ROOT, generatedTree),
            ]),

            generateExport(context.module, MODULE_ROOT_ID),

            ...errors,
          ]),
        ),
      )
      .catch(ex => {
        if (
          typeof globalThis.process?.exit === 'function' &&
          globalThis.process.exit.length === 1
        ) {
          console.error(new WriteError(ex?.message ?? '', source));
          return void globalThis.process.exit(1);
        }

        // we could actually catch it, but let's move the burden of that error to consumer
        throw new WriteError(ex?.message ?? '', source);
      }),
  );

  await Promise.allSettled(promises);

  return parentModule;
}
