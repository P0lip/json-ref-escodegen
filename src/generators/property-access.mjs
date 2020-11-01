import {
  binaryExpression,
  callExpression,
  identifier,
  ifStatement,
  literal,
  logicalExpression,
  memberExpression,
  newExpression,
  returnStatement,
  templateElement,
  templateLiteral,
  throwStatement,
  unaryExpression,
} from '../builders.mjs';
import { pathToPointer } from '../pointers/index.mjs';
import { getModuleSource } from '../runtime/index.mjs';
import { MissingPointerError } from '../runtime/errors/pointers.mjs';
import { MODULE_ROOT, MODULE_ROOT_ID } from './consts.mjs';
import { safeIdentifier } from './index.mjs';

const EMPTY_TEMPLATE_ELEMENT = templateElement({ cooked: '', raw: '' }, false);

function isObjectAndNotNull(value) {
  return logicalExpression(
    '&&',
    binaryExpression(
      '===',
      unaryExpression('typeof', value),
      literal('object'),
    ),
    binaryExpression('!==', value, literal(null)),
  );
}

export default function (root, path, context) {
  let expression = root === MODULE_ROOT_ID ? MODULE_ROOT : safeIdentifier(root);
  const rootIdentifier = expression;
  let test = expression === MODULE_ROOT ? null : isObjectAndNotNull(expression);

  let i = 0;
  for (const segment of path) {
    i++;

    expression = memberExpression(expression, literal(segment), true);

    const right =
      i === path.length
        ? binaryExpression('in', expression.property, expression.object)
        : isObjectAndNotNull(expression);

    if (test !== null) {
      test = logicalExpression('&&', test, right);
    } else {
      test = right;
    }
  }

  context.dependencies.addRuntimeDependency(MissingPointerError.name);
  context.dependencies.addRuntimeDependency(getModuleSource.name);

  return ifStatement(
    test,
    returnStatement(expression),
    throwStatement(
      newExpression(identifier(MissingPointerError.name), [
        templateLiteral(
          [
            EMPTY_TEMPLATE_ELEMENT,
            templateElement(
              {
                get cooked() {
                  console.log(this);
                  return this.value;
                },
                raw: ` has no "${pathToPointer(path)}" pointer`,
              },
              true,
            ),
          ],
          [callExpression(identifier(getModuleSource.name), [rootIdentifier])],
        ),
      ]),
    ),
  );
}
