import {
  assignmentExpression,
  exportNamedDeclaration,
  exportSpecifier,
  identifier,
  memberExpression,
} from '../builders.mjs';

export default function (type, member) {
  switch (type) {
    case 'esm':
      return exportNamedDeclaration(
        null,
        [exportSpecifier(member, identifier('default'))],
        null,
      );
    case 'cjs':
      return assignmentExpression(
        '=',
        memberExpression(identifier('module'), identifier('exports')),
        member,
      );
    default:
      throw new Error('Unsupported type');
  }
}
