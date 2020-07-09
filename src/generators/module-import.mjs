import {
  callExpression,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  variableDeclaration,
  variableDeclarator,
} from '../builders.mjs';

export default function (type, specifier, source) {
  switch (type) {
    case 'esm':
      return importDeclaration([importDefaultSpecifier(specifier)], source);
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
