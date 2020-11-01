import { blockStatement, literal, returnStatement } from '../builders.mjs';
import {
  InvalidPointerError,
  PointerError,
} from '../runtime/errors/pointers.mjs';
import { File } from '../modules.mjs';
import { parseRef, pointerToPath } from '../pointers/index.mjs';
import assertValidModule from '../runtime/modules/assert-valid.mjs';
import { MODULE_ROOT_ID } from './consts.mjs';
import generateError from './error.mjs';
import { generateModuleAssertion, safeIdentifier } from './index.mjs';
import generatePropertyAccess from './property-access.mjs';

export default function (obj, context) {
  const traversePath = context.traverse.path.slice();
  context.dependencies.parentModule.addGetterPath(traversePath);

  if (typeof obj.$ref !== 'string') {
    context.dependencies.addRuntimeDependency(InvalidPointerError.name);
    return generateError(
      InvalidPointerError.name,
      'Pointer should be a string',
    );
  } else {
    const { path } = context;
    try {
      const { pointer, source } = parseRef(obj.$ref);

      let actualIdentifier = MODULE_ROOT_ID;

      // todo: not the best spot for this...
      if (source !== '') {
        const module = File.getFromRegistry(
          path.isAbsolute(source)
            ? path.normalize(source)
            : path.join(
                path.dirname(context.dependencies.parentModule.source),
                source,
              ),
          context,
        );

        context.dependencies.addModule(module);

        if (module !== context.dependencies.parentModule) {
          context.dependencies.addModule(module);
          context.dependencies.addRuntimeDependency(assertValidModule.name);
          actualIdentifier = module.id;
        }

        module.addRetainer(context.dependencies.parentModule, traversePath);
      } else {
        context.dependencies.parentModule.addInlineRetainer(
          pointer,
          traversePath,
        );
      }

      const propertyPath = pointerToPath(pointer);

      // todo: mamma mia
      return blockStatement(
        context.transformInline(pointer)
          ? propertyPath === null
            ? actualIdentifier !== MODULE_ROOT_ID
              ? [
                  generateModuleAssertion(actualIdentifier),
                  returnStatement(safeIdentifier(actualIdentifier)),
                ]
              : [returnStatement(safeIdentifier(actualIdentifier))]
            : actualIdentifier !== MODULE_ROOT_ID
            ? [
                generateModuleAssertion(actualIdentifier),
                generatePropertyAccess(actualIdentifier, propertyPath, context),
              ]
            : [generatePropertyAccess(actualIdentifier, propertyPath, context)]
          : [returnStatement(literal(pointer))],
      );
    } catch (ex) {
      if (ex instanceof PointerError) {
        context.dependencies.addRuntimeDependency(ex.constructor.name);
      }

      return generateError(ex.constructor.name, ex.message);
    }
  }
}
