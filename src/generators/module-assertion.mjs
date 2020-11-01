import { callExpression, identifier } from '../builders.mjs';
import { assertValidModule } from '../runtime/index.mjs';
import { safeIdentifier } from './index.mjs';

const ASSERT_VALID_MODULE = identifier(assertValidModule.name);

export default function generateModuleAssertion(id) {
  return callExpression(ASSERT_VALID_MODULE, [safeIdentifier(id)]);
}
