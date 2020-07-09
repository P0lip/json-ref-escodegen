import { blockStatement, returnStatement } from '../builders.mjs';
import { DefaultModule } from '../modules.mjs';
import { parsePointer, pointerToPath } from '../pointers/index.mjs';
import { MODULE_ROOT_IDENTIFIER } from './consts.mjs';
import generateError from './error.mjs';
import generatePropertyPath from './property-path.mjs';
import safeIdentifier from './safe-identifier.mjs';

export default function (obj, context) {
  if (typeof obj.$ref !== 'string') {
    return generateError('SyntaxError', 'JSON Pointer should be a string');
  } else {
    const { path } = context;
    try {
      const { pointer, source } = parsePointer(obj.$ref);

      let actualIdentifier = MODULE_ROOT_IDENTIFIER;

      if (source !== '') {
        const module = DefaultModule.getFromRegistry(
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
          actualIdentifier = safeIdentifier(module.id);
        }

        // todo: include parentModule
        module.retainers.add(pointer);
      }

      const propertyPath = pointerToPath(pointer);

      return blockStatement([
        returnStatement(
          propertyPath === null
            ? actualIdentifier
            : generatePropertyPath(actualIdentifier, propertyPath),
        ),
      ]);
    } catch (ex) {
      return generateError(ex.constructor.name, ex.message);
    }
  }
}
