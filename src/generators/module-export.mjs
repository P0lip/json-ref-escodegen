import {
  assignmentExpression,
  exportNamedDeclaration,
  exportSpecifier,
  identifier,
  memberExpression,
} from '../builders.mjs';

export default function (type, specifier) {
  switch (type) {
    case 'esm':
      return exportNamedDeclaration(
        null,
        [exportSpecifier(identifier(specifier), identifier('default'))],
        null,
      );
    case 'cjs':
      return assignmentExpression(
        '=',
        memberExpression(identifier('module'), identifier('exports')),
        identifier(specifier),
      );
    default:
      throw new Error('Unsupported type');
  }
}
