import { MODULE_ERROR_SYMBOL } from './core.mjs';

export default function createErrorStub(message) {
  return {
    [MODULE_ERROR_SYMBOL]: message,
  };
}
