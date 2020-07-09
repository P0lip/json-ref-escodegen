import mocha from 'mocha';
import chai from 'chai';
import chaiSnapshot from 'mocha-chai-snapshot';
import sinon from 'sinon';
import path from 'path';
import { fileURLToPath } from 'url';

import generate, { Dependencies, ModuleRegistry } from '../index.mjs';
import createFakeRequire from './__utils__/createFakeRequire.mjs';

const { describe, it, beforeEach } = mocha;
const { expect } = chai;

chai.use(chaiSnapshot);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Codegen resolver', function () {
  let fs;

  beforeEach(() => {
    fs = {
      read: sinon.stub(),
      write: sinon.stub(),
    };
  });

  it('no $refs', async () => {
    const document = {
      info: {
        contact: {
          test: {},
        },
      },
      x: 'foo',
    };

    fs.read.resolves(document);

    await generate('foo.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './448841657.mjs',
      `const $ = {
  "info": {
    "contact": {
      "test": {}
    }
  },
  "x": "foo"
};
export {$ as default};
`,
    ]);
  });

  it('inline $refs only', async () => {
    const document = {
      info: {
        contact: {
          test: {
            $ref: '#/x',
          },
        },
      },
      x: 'foo',
      b: {
        $ref: '#/info/contact',
      },
    };

    fs.read.returns(document);

    await generate('foo.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './448841657.mjs',
      `const $ = {
  "info": {
    "contact": {
      get "test"() {
        return $["x"];
      }
    }
  },
  "x": "foo",
  get "b"() {
    return $["info"]["contact"];
  }
};
export {$ as default};
`,
    ]);
  });

  it('direct circular', async () => {
    const document = {
      a: {
        $ref: '#/b',
      },
      b: {
        $ref: '#/a',
      },
    };

    fs.read.returns(document);

    await generate('bar.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './1359479870.mjs',
      `const $ = {
  get "a"() {
    return $["b"];
  },
  get "b"() {
    return $["a"];
  }
};
export {$ as default};
`,
    ]);
  });

  it('indirect circular', async () => {
    const document = {
      a: {
        $ref: '#/b',
      },
      b: {
        $ref: '#/c',
      },
      c: {
        $ref: '#/a',
      },
    };

    fs.read.returns(document);

    await generate('bar.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './1359479870.mjs',
      `const $ = {
  get "a"() {
    return $["b"];
  },
  get "b"() {
    return $["c"];
  },
  get "c"() {
    return $["a"];
  }
};
export {$ as default};
`,
    ]);
  });

  it('plain external', async () => {
    const cwd = '/home/baz/project';
    const document = {
      a: {
        $ref: './foo.json#',
      },
      b: {
        $ref: './foo.json#/foo',
      },
    };

    fs.read
      .withArgs(path.join(cwd, 'bar.json'))
      .resolves(document)
      .withArgs(path.join(cwd, 'foo.json'))
      .resolves({
        foo: true,
      });

    await generate(path.join(cwd, 'bar.json'), {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './4112716709.mjs',
      `import _1021158662 from "./1021158662.mjs";
const $ = {
  get "a"() {
    return _1021158662;
  },
  get "b"() {
    return _1021158662["foo"];
  }
};
export {$ as default};
`,
    ]);

    expect(fs.write.getCall(1).args).to.deep.equal([
      './1021158662.mjs',
      `const $ = {
  "foo": true
};
export {$ as default};
`,
    ]);
  });

  it('external self-referencing', async () => {
    const cwd = '/home/baz/project';
    const document = {
      a: {
        $ref: './foo.json#/a',
      },
    };

    fs.read.withArgs(path.join(cwd, 'foo.json')).resolves(document);

    await generate(path.join(cwd, 'foo.json'), {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './1021158662.mjs',
      `const $ = {
  get "a"() {
    return $["a"];
  }
};
export {$ as default};
`,
    ]);
  });

  it('commonjs', async () => {
    const cwd = '/home/baz/project';
    const document = {
      a: {
        $ref: './foo.json#',
      },
      b: {
        $ref: './foo.json#/foo',
      },
    };

    fs.read
      .withArgs(path.join(cwd, 'bar.json'))
      .resolves(document)
      .withArgs(path.join(cwd, 'foo.json'))
      .resolves({
        foo: true,
      });

    await generate(path.join(cwd, 'bar.json'), {
      module: 'cjs',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './4112716709.cjs',
      `const _1021158662 = require("./1021158662.cjs");
const $ = {
  get "a"() {
    return _1021158662;
  },
  get "b"() {
    return _1021158662["foo"];
  }
};
module.exports = $
`,
    ]);

    expect(fs.write.getCall(1).args).to.deep.equal([
      './1021158662.cjs',
      `const $ = {
  "foo": true
};
module.exports = $
`,
    ]);
  });

  it('arrays', async () => {
    const document = [
      {
        b: true,
      },
      {
        $ref: '#/0',
      },
    ];

    fs.read.withArgs('foo.json').resolves(document);

    await generate('foo.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './448841657.mjs',
      `import _createArray from "json-ref-escodegen/runtime/create-array.mjs";
const $ = _createArray([{
  "b": true
}, {
  "$ref": "#/0"
}], [[1, function () {
  return $["0"];
}]]);
export {$ as default};
`,
    ]);
  });

  it('skips functions', async () => {
    const document = {
      a() {},
    };

    fs.read.withArgs('foo.json').resolves(document);

    await generate('foo.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './448841657.mjs',
      `const $ = {};
export {$ as default};
`,
    ]);
  });

  it('generates syntax error getter for invalid $ref', async () => {
    const document = {
      a: {
        $ref: 1,
      },
    };

    fs.read.withArgs('foo.json').resolves(document);

    await generate('foo.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      moduleRegistry: new ModuleRegistry(),
      path,
    });

    expect(fs.write.getCall(0).args).to.deep.equal([
      './448841657.mjs',
      `const $ = {
  get "a"() {
    throw new SyntaxError("JSON Pointer should be a string");
  }
};
export {$ as default};
`,
    ]);
  });

  describe('real samples', () => {
    beforeEach(async () => {
      fs.read = (await import('fs')).promises.readFile;
      fs.write.callsFake(
        () =>
          new Promise(
            resolve =>
              void setTimeout(resolve, Math.floor(Math.random() * 500)),
          ),
      );
    });

    describe('root.json', function () {
      it('esm', async function () {
        const source = path.join(__dirname, '__fixtures__/root.json');
        const dist = path.join(__dirname, '__fixtures__/void');
        const output = {};

        await generate(source, {
          module: 'esm',
          fs: {
            read: async src => JSON.parse(await fs.read(src, 'utf8')),
            async write(target, content) {
              output[path.join(dist, target)] = content;
            },
          },
          path,
          dependencies: new Dependencies(),
          moduleRegistry: new ModuleRegistry(),
        });

        expect(output).to.matchSnapshot(this);
      });

      it('actual stringified text', async function () {
        const source = path.join(__dirname, '__fixtures__/root.json');
        const output = {};

        const { id } = await generate(source, {
          module: 'cjs',
          fs: {
            read: async src => JSON.parse(await fs.read(src, 'utf8')),
            async write(target, content) {
              output[target] = content;
            },
          },
          path,
          dependencies: new Dependencies(),
          moduleRegistry: new ModuleRegistry(),
        });

        const require = createFakeRequire(output);

        expect(require(`./${id}.cjs`)).to.matchSnapshot(this);
      });
    });
  });
});
