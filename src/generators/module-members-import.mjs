import {
  callExpression,
  identifier,
  importDeclaration,
  importSpecifier,
  literal,
  objectPattern,
  property,
  variableDeclaration,
  variableDeclarator,
} from '../builders.mjs';

function generateSpecifier(specifier) {
  const id = identifier(specifier);
  return importSpecifier(id, id);
}

function generateProperty(specifier) {
  const id = identifier(specifier);
  return property('init', id, id);
}

export default function (type, specifiers, source) {
  switch (type) {
    case 'esm':
      return importDeclaration(
        specifiers.map(generateSpecifier),
        literal(source),
      );
    case 'cjs':
      return variableDeclaration('const', [
        variableDeclarator(
          objectPattern(specifiers.map(generateProperty)),
          callExpression(identifier('require'), [literal(source)]),
        ),
      ]);
    default:
      throw new Error('Unsupported type');
  }
}
