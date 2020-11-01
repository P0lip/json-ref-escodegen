import mocha from 'mocha';
import chai from 'chai';
import astring from 'astring';
import prettier from 'prettier';
import Dependencies from '../../dependencies.mjs';

import generatePropertyAccess from '../property-access.mjs';

const { describe, it, beforeEach } = mocha;
const { expect } = chai;

describe('generators/property-access', () => {
  let context;

  beforeEach(() => {
    context = { dependencies: new Dependencies() };
  });

  it('single property', () => {
    expect(
      prettier.format(
        astring.generate(generatePropertyAccess('root', ['foo'], context)),
      ),
    ).to
      .equal(`if (typeof _root === "object" && _root !== null && "foo" in _root)
  return _root["foo"];
else
  throw new MissingPointerError(
    \`\${getModuleSource(_root)} has no "#/foo" pointer\`
  );
`);
  });

  it('nested path', () => {
    expect(
      prettier.format(
        astring.generate(
          generatePropertyAccess('root', ['foo', 'bar', 'baz'], context),
        ),
      ),
    ).to.equal(`if (
  typeof _root === "object" &&
  _root !== null &&
  typeof _root["foo"] === "object" &&
  _root["foo"] !== null &&
  typeof _root["foo"]["bar"] === "object" &&
  _root["foo"]["bar"] !== null &&
  "baz" in _root["foo"]["bar"]
)
  return _root["foo"]["bar"]["baz"];
else
  throw new MissingPointerError(
    \`\${getModuleSource(_root)} has no "#/foo/bar/baz" pointer\`
  );
`);
  });
});
