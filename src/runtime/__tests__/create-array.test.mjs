import mocha from 'mocha';
import chai from 'chai';
import createArray from '../create-array.mjs';

const { describe, it } = mocha;
const { expect } = chai;

describe('createArray runtime util', () => {
  it('does not touch unspecified elements', () => {
    const arr = createArray(
      [
        {
          foo: 1,
        },
        {
          bar: 0,
        },
      ],
      [],
    );

    expect(Object.getOwnPropertyDescriptors(arr)).to.deep.equal({
      '0': {
        configurable: true,
        enumerable: true,
        value: {
          foo: 1,
        },
        writable: true,
      },
      '1': {
        configurable: true,
        enumerable: true,
        value: {
          bar: 0,
        },
        writable: true,
      },
      length: {
        configurable: false,
        enumerable: false,
        value: 2,
        writable: true,
      },
    });
  });
});
