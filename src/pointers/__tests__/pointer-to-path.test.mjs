import mocha from 'mocha';
import chai from 'chai';
import { pointerToPath } from '../index.mjs';

const { describe, it } = mocha;
const { expect } = chai;

describe('Pointer to path util', () => {
  it('given too short pointer, returns null', () => {
    expect(pointerToPath('')).to.be.null;
    expect(pointerToPath('#')).to.be.null;
  });

  it('understands slashes', () => {
    expect(pointerToPath('#/')).to.deep.equal(['']);
    expect(pointerToPath('#//')).to.deep.equal(['', '']);
    expect(pointerToPath('#/a/')).to.deep.equal(['a', '']);
  });

  it('decodes ~0 and ~1', () => {
    expect(pointerToPath('#/foo~0/bar~1')).to.deep.equal(['foo~', 'bar/']);
  });
});
