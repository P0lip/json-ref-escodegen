import { getModuleSource, MODULE_ERROR_SYMBOL } from './core.mjs';
import { ReadError } from '../errors/fs.mjs';

export default function assertValidModule(module) {
  if (MODULE_ERROR_SYMBOL in module) {
    throw new ReadError(module[MODULE_ERROR_SYMBOL], getModuleSource(module));
  }
}
