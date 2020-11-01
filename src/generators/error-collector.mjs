import {
  arrayExpression,
  arrowFunctionExpression,
  callExpression,
  identifier,
  literal,
  memberExpression,
  objectExpression,
  property,
  unaryExpression,
  variableDeclaration,
  variableDeclarator,
} from '../builders.mjs';
import { pathToPointer } from '../pointers/index.mjs';
import { collectPotentialError } from '../runtime/errors/collector.mjs';
import { registerModule } from '../runtime/modules/core.mjs';
import { MODULE_ERRORS, MODULE_ROOT, MODULE_SOURCE } from './consts.mjs';

const COLLECT_ERRORS = [
  variableDeclaration('const', [
    variableDeclarator(MODULE_ERRORS, arrayExpression([])),
  ]),

  callExpression(identifier(registerModule.name), [
    MODULE_ROOT,
    objectExpression([
      property('init', identifier('errors'), MODULE_ERRORS),
      property('init', identifier('source'), MODULE_SOURCE),
    ]),
  ]),
];

export default function generateErrorCollector(source, pointers, context) {
  const block = COLLECT_ERRORS.slice();

  context.dependencies.addRuntimeDependency(registerModule.name);

  block.unshift(
    variableDeclaration('const', [
      variableDeclarator(MODULE_SOURCE, literal(source)),
    ]),
  );

  if (pointers.size === 0) {
    return block;
  }

  context.dependencies.addRuntimeDependency(collectPotentialError.name);

  for (const path of pointers) {
    let expression = MODULE_ROOT;

    for (let i = 0; i < path.length - 1; i++) {
      expression = memberExpression(expression, literal(path[i]), true);
    }

    block.push(
      callExpression(identifier(collectPotentialError.name), [
        MODULE_ERRORS,
        literal(pathToPointer(path)),
        arrowFunctionExpression(
          null,
          [],
          unaryExpression(
            'void',
            callExpression(
              memberExpression(identifier('Reflect'), identifier('get')),
              [expression, literal(path[path.length - 1])],
            ),
          ),
        ),
      ]),
    );
  }

  return block;
}
