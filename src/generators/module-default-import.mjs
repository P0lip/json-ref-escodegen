import {
  callExpression,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  literal,
  variableDeclaration,
  variableDeclarator,
} from '../builders.mjs';
import safeIdentifier from './safe-identifier.mjs';

export default function (type, specifier, source) {
  switch (type) {
    case 'esm':
      return importDeclaration(
        [importDefaultSpecifier(safeIdentifier(specifier))],
        literal(source),
      );
    case 'cjs':
      return variableDeclaration('const', [
        variableDeclarator(
          safeIdentifier(specifier),
          callExpression(identifier('require'), [literal(source)]),
        ),
      ]);
    default:
      throw new Error('Unsupported type');
  }
}
