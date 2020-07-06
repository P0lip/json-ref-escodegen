import {
  callExpression,
  identifier,
  importDeclaration,
  importSpecifier,
  variableDeclaration,
  variableDeclarator,
} from '../builders.mjs';

export default function (type, specifier, source) {
  switch (type) {
    case 'esm':
      return importDeclaration(
        [importSpecifier(specifier, identifier('default'))],
        source,
      );
    case 'cjs':
      return variableDeclaration('const', [
        variableDeclarator(
          specifier,
          callExpression(identifier('require'), [source]),
        ),
      ]);
    default:
      throw new Error('Unsupported type');
  }
}
