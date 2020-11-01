import mocha from 'mocha';
import chai from 'chai';
import safeStringify from '../safe-stringify.mjs';

const { describe, it } = mocha;
const { expect } = chai;

describe('safeStringify', () => {
  it('basic scenario', () => {
    const document = {
      a: {
        b: true,
        c: {
          get d() {
            return document.a.c;
          },
        },
        get e() {
          return document.a;
        },
      },
      f: 'x',
    };

    expect(JSON.stringify(safeStringify(document), null, 2)).to.equal(`{
  "a": {
    "b": true,
    "c": {
      "d": {
        "d": {
          "d": {
            "$ref": "#/a/c/d/d/d"
          }
        }
      }
    },
    "e": {
      "b": true,
      "c": {
        "d": {
          "d": {
            "d": {
              "$ref": "#/a/e/c/d/d/d"
            }
          }
        }
      },
      "e": {
        "$ref": "#/a/e/e"
      }
    }
  },
  "f": "x"
}`);
  });

  it('circular getter', () => {
    const document = {
      a: {
        b: true,
        c: {
          get d() {
            return document.a.c.d;
          },
        },
        get e() {
          return document.a;
        },
      },
      f: 'x',
    };

    expect(JSON.stringify(safeStringify(document), null, 2)).to.equal(`{
  "a": {
    "b": true,
    "c": {
      "d": {
        "$ref": "#/a/c/d"
      }
    },
    "e": {
      "b": true,
      "c": {
        "d": {
          "$ref": "#/a/e/c/d"
        }
      },
      "e": {
        "$ref": "#/a/e/e"
      }
    }
  },
  "f": "x"
}`);
  });
});
