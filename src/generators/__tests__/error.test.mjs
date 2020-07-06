import mocha from 'mocha';
import chai from 'chai';
import astring from 'astring';

import generateError from '../error.mjs';

const { describe, it } = mocha;
const { expect } = chai;

describe('Error generator', () => {
  it('syntax error', () => {
    expect(
      astring.generate(
        generateError('SyntaxError', 'JSON Pointer should be a string'),
      ),
    ).to.equal(`{
  throw new SyntaxError("JSON Pointer should be a string");
}`);
  });
});
