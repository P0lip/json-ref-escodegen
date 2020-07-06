import {
  identifier,
  memberExpression,
  property,
  literal,
} from '../builders.mjs';

export const MODULE_ROOT_IDENTIFIER = identifier('$');

export const OBJECT_DEFINE_PROPERTIES = memberExpression(
  identifier('Object'),
  identifier('defineProperties'),
);

export const DEFAULT_DESCRIPTORS = [
  property('init', identifier('configurable'), literal(true)),
  property('init', identifier('enumerable'), literal(true)),
];
