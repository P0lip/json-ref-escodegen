/* eslint-disable sort-keys */

// since our usage is fairly narrow, we don't really need to install extra deps such ast-types or @babel/types.
// the set of builders I've prepared here should be sufficient for our needs

export function program(body) {
  return {
    type: 'Program',
    body,
  };
}

export function literal(value) {
  return {
    type: 'Literal',
    value,
  };
}

export function templateLiteral(quasis, expressions) {
  return {
    type: 'TemplateLiteral',
    quasis,
    expressions,
  };
}

export function templateElement(value, tail) {
  return {
    type: 'TemplateElement',
    value,
    tail,
  };
}

export function identifier(name) {
  return {
    type: 'Identifier',
    name,
  };
}

export function logicalExpression(operator, left, right) {
  return {
    type: 'LogicalExpression',
    operator,
    left,
    right,
  };
}

export function binaryExpression(operator, left, right) {
  return {
    type: 'BinaryExpression',
    operator,
    left,
    right,
  };
}

export function unaryExpression(operator, argument, prefix = true) {
  return {
    type: 'UnaryExpression',
    operator,
    argument,
    prefix,
  };
}

export function memberExpression(object, property, computed = false) {
  return {
    type: 'MemberExpression',
    object,
    property,
    computed,
  };
}

export function assignmentExpression(operator, left, right) {
  return {
    type: 'AssignmentExpression',
    operator,
    left,
    right,
  };
}

export function callExpression(callee, _arguments) {
  return {
    type: 'CallExpression',
    callee,
    arguments: _arguments,
  };
}

export function functionDeclaration(id, params, body) {
  return {
    type: 'FunctionDeclaration',
    id,
    params,
    body,
  };
}

export function returnStatement(argument) {
  return {
    type: 'ReturnStatement',
    argument,
  };
}

export function sequenceExpression(expressions) {
  return {
    type: 'SequenceExpression',
    expressions,
  };
}

export function objectExpression(properties) {
  return {
    type: 'ObjectExpression',
    properties,
  };
}

export function arrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements,
  };
}

export function property(kind, key, value) {
  return {
    type: 'Property',
    key,
    value,
    kind,
  };
}

export function functionExpression(id, params, body, generator, async) {
  return {
    type: 'FunctionExpression',
    id,
    params,
    body,
    generator,
    async,
  };
}

export function arrowFunctionExpression(id, params, body, generator, async) {
  return {
    type: 'ArrowFunctionExpression',
    id,
    params,
    body,
    generator,
    async,
  };
}

export function exportNamedDeclaration(declaration, specifiers, source) {
  return {
    type: 'ExportNamedDeclaration',
    declaration,
    specifiers,
    source,
  };
}

export function exportSpecifier(local, exported) {
  return {
    type: 'ExportSpecifier',
    local,
    exported,
  };
}

export function variableDeclaration(kind, declarations) {
  return {
    type: 'VariableDeclaration',
    kind,
    declarations,
  };
}

export function variableDeclarator(id, init) {
  return {
    type: 'VariableDeclarator',
    id,
    init,
  };
}

export function blockStatement(body) {
  return {
    type: 'BlockStatement',
    body,
  };
}

export function throwStatement(argument) {
  return {
    type: 'ThrowStatement',
    argument,
  };
}

export function newExpression(callee, _arguments) {
  return {
    type: 'NewExpression',
    arguments: _arguments,
    callee,
  };
}

export function importDeclaration(specifiers, source) {
  return {
    type: 'ImportDeclaration',
    specifiers,
    source,
  };
}

export function importSpecifier(local, imported) {
  return {
    type: 'ImportSpecifier',
    local,
    imported,
  };
}

export function importDefaultSpecifier(local) {
  return {
    type: 'ImportDefaultSpecifier',
    local,
  };
}

export function ifStatement(test, consequent, alternate) {
  return {
    type: 'IfStatement',
    test,
    consequent,
    alternate,
  };
}

export function objectPattern(properties) {
  return {
    type: 'ObjectPattern',
    properties,
  };
}
