import { identifier } from '../builders.mjs';
import safeIdentifier from './safe-identifier.mjs';

export const MODULE_ROOT_IDENTIFIER = identifier('$');

export const CREATE_ARRAY_ID = 'createArray';
export const CREATE_ARRAY = safeIdentifier(CREATE_ARRAY_ID);
