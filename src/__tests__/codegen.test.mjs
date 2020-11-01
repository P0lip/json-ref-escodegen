import mocha from 'mocha';
import chai from 'chai';
import chaiSnapshot from 'mocha-chai-snapshot';
import sinon from 'sinon';
import path from 'path';

import generate, { Dependencies, Traverse } from '../index.mjs';

const { describe, it, beforeEach } = mocha;
const { expect } = chai;

chai.use(chaiSnapshot);

describe('Codegen', function () {
  let fs;

  beforeEach(() => {
    fs = {
      read: sinon.stub(),
      write: sinon.stub(),
    };

    fs.write.resolves(void 0);
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);
    expect(fs.write.getCall(0).args[0]).to.equal('./448841657.mjs');
    expect(fs.write.getCall(0).args[1]).to
      .equal(`import {registerModule} from "json-ref-escodegen/runtime/index.mjs";
const $ = {
  "info": {
    "contact": {
      "test": {}
    }
  },
  "x": "foo"
};
export {$ as default};
const $_source = "foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
`);
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);
    expect(fs.write.getCall(0).args[0]).to.equal('./448841657.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `import {MissingPointerError, getModuleSource, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
const $ = {
  "info": {
    "contact": {
      get "test"() {
        if (("x" in $)) return $["x"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/x" pointer\`);
      }
    }
  },
  "x": "foo",
  get "b"() {
    if (typeof $["info"] === "object" && $["info"] !== null && ("contact" in $["info"])) return $["info"]["contact"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/info/contact" pointer\`);
  }
};
export {$ as default};
const $_source = "foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/info/contact/test", () => void Reflect.get($["info"]["contact"], "test"))
collectPotentialError($_errors, "#/b", () => void Reflect.get($, "b"))
`,
    );
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);
    expect(fs.write.getCall(0).args[0]).to.equal('./1359479870.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `import {MissingPointerError, getModuleSource, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
const $ = {
  get "a"() {
    if (("b" in $)) return $["b"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/b" pointer\`);
  },
  get "b"() {
    if (("a" in $)) return $["a"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/a" pointer\`);
  }
};
export {$ as default};
const $_source = "bar.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/a", () => void Reflect.get($, "a"))
collectPotentialError($_errors, "#/b", () => void Reflect.get($, "b"))
`,
    );
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);
    expect(fs.write.getCall(0).args[0]).to.equal('./1359479870.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `import {MissingPointerError, getModuleSource, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
const $ = {
  get "a"() {
    if (("b" in $)) return $["b"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/b" pointer\`);
  },
  get "b"() {
    if (("c" in $)) return $["c"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/c" pointer\`);
  },
  get "c"() {
    if (("a" in $)) return $["a"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/a" pointer\`);
  }
};
export {$ as default};
const $_source = "bar.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/a", () => void Reflect.get($, "a"))
collectPotentialError($_errors, "#/b", () => void Reflect.get($, "b"))
collectPotentialError($_errors, "#/c", () => void Reflect.get($, "c"))
`,
    );
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(2);

    expect(fs.write.getCall(0).args[0]).to.equal('./4112716709.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `import {assertValidModule, MissingPointerError, getModuleSource, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
import _1021158662 from "./1021158662.mjs";
const $ = {
  get "a"() {
    assertValidModule(_1021158662)
    return _1021158662;
  },
  get "b"() {
    assertValidModule(_1021158662)
    if (typeof _1021158662 === "object" && _1021158662 !== null && ("foo" in _1021158662)) return _1021158662["foo"]; else throw new MissingPointerError(\`\${getModuleSource(_1021158662)} has no "#/foo" pointer\`);
  }
};
export {$ as default};
const $_source = "/home/baz/project/bar.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/a", () => void Reflect.get($, "a"))
collectPotentialError($_errors, "#/b", () => void Reflect.get($, "b"))
`,
    );

    expect(fs.write.getCall(1).args[0]).to.equal('./1021158662.mjs');
    expect(fs.write.getCall(1).args[1]).to.equal(
      `import {registerModule} from "json-ref-escodegen/runtime/index.mjs";
const $ = {
  "foo": true
};
export {$ as default};
const $_source = "/home/baz/project/foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
`,
    );
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);
    expect(fs.write.getCall(0).args[0]).to.equal('./1021158662.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      // todo: $.a does not need any checks
      `import {MissingPointerError, getModuleSource, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
const $ = {
  get "a"() {
    if (("a" in $)) return $["a"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/a" pointer\`);
  }
};
export {$ as default};
const $_source = "/home/baz/project/foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/a", () => void Reflect.get($, "a"))
`,
    );
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(2);

    expect(fs.write.getCall(0).args[0]).to.equal('./4112716709.cjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `const {assertValidModule: assertValidModule, MissingPointerError: MissingPointerError, getModuleSource: getModuleSource, registerModule: registerModule, collectPotentialError: collectPotentialError} = require("json-ref-escodegen/runtime/index.cjs");
const _1021158662 = require("./1021158662.cjs");
const $ = {
  get "a"() {
    assertValidModule(_1021158662)
    return _1021158662;
  },
  get "b"() {
    assertValidModule(_1021158662)
    if (typeof _1021158662 === "object" && _1021158662 !== null && ("foo" in _1021158662)) return _1021158662["foo"]; else throw new MissingPointerError(\`\${getModuleSource(_1021158662)} has no "#/foo" pointer\`);
  }
};
module.exports = $
const $_source = "/home/baz/project/bar.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/a", () => void Reflect.get($, "a"))
collectPotentialError($_errors, "#/b", () => void Reflect.get($, "b"))
`,
    );

    expect(fs.write.getCall(1).args[0]).to.equal('./1021158662.cjs');
    expect(fs.write.getCall(1).args[1]).to.equal(
      `const {registerModule: registerModule} = require("json-ref-escodegen/runtime/index.cjs");
const $ = {
  "foo": true
};
module.exports = $
const $_source = "/home/baz/project/foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
`,
    );
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);

    expect(fs.write.getCall(0).args[0]).to.equal('./448841657.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `import {createArray, MissingPointerError, getModuleSource, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
const $ = createArray([{
  "b": true
}, {
  "$ref": "#/0"
}], [["1", function () {
  if (("0" in $)) return $["0"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/0" pointer\`);
}]]);
export {$ as default};
const $_source = "foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/1", () => void Reflect.get($, "1"))
`,
    );
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
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);

    expect(fs.write.getCall(0).args[0]).to.equal('./448841657.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `import {registerModule} from "json-ref-escodegen/runtime/index.mjs";
const $ = {};
export {$ as default};
const $_source = "foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
`,
    );
  });

  it('skips symbols', async () => {
    const document = {
      a: Symbol(''),
    };

    fs.read.withArgs('foo.json').resolves(document);

    await generate('foo.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);
    expect(fs.write.getCall(0).args[0]).to.equal('./448841657.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `import {registerModule} from "json-ref-escodegen/runtime/index.mjs";
const $ = {};
export {$ as default};
const $_source = "foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
`,
    );
  });

  it('generates syntax error getter for invalid $ref', async () => {
    const document = {
      a: {
        $ref: 1,
      },
      b: {
        $ref: 'foo#a',
      },
      c: {
        $ref: null,
      },
    };

    fs.read.withArgs('foo.json').resolves(document);

    await generate('foo.json', {
      module: 'esm',
      fs,
      dependencies: new Dependencies(),
      path,
      traverse: new Traverse({
        skipGetters: false,
      }),
      transformExternal: () => true,
      transformInline: () => true,
    });

    expect(fs.write.getCalls()).to.have.length(1);
    expect(fs.write.getCall(0).args[0]).to.equal('./448841657.mjs');
    expect(fs.write.getCall(0).args[1]).to.equal(
      `import {InvalidPointerError, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
const $ = {
  get "a"() {
    throw new InvalidPointerError("Pointer should be a string");
  },
  get "b"() {
    throw new InvalidPointerError("Pointer pointing at other property than root needs to start with #/");
  },
  get "c"() {
    throw new InvalidPointerError("Pointer should be a string");
  }
};
export {$ as default};
const $_source = "foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/a", () => void Reflect.get($, "a"))
collectPotentialError($_errors, "#/b", () => void Reflect.get($, "b"))
collectPotentialError($_errors, "#/c", () => void Reflect.get($, "c"))
`,
    );
  });

  describe('selective resolving', () => {
    it('preserves ignored inline $refs', async () => {
      const document = {
        a: {
          $ref: '#/skip/me',
        },
        b: {
          $ref: '#/b',
        },
        c: {
          $ref: '#/skip/you',
        },
      };

      fs.read.returns(document);

      await generate('foo.json', {
        module: 'esm',
        fs,
        dependencies: new Dependencies(),
        path,
        traverse: new Traverse({
          skipGetters: false,
        }),
        transformExternal: () => true,
        transformInline: pointer => !pointer.startsWith('#/skip/'),
      });

      expect(fs.write.getCall(0).args[0]).to.equal('./448841657.mjs');
      expect(fs.write.getCall(0).args[1]).to
        .equal(`import {MissingPointerError, getModuleSource, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
const $ = {
  "a": {
    "$ref": "#/skip/me"
  },
  get "b"() {
    if (("b" in $)) return $["b"]; else throw new MissingPointerError(\`\${getModuleSource($)} has no "#/b" pointer\`);
  },
  "c": {
    "$ref": "#/skip/you"
  }
};
export {$ as default};
const $_source = "foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/b", () => void Reflect.get($, "b"))
`);
    });

    it('treats external document as plain text to evaluate', async () => {
      const cwd = '/home/baz/project';
      const document = {
        a: {
          $ref: './foo.json#',
        },
      };

      fs.read
        .withArgs(path.join(cwd, 'bar.json'))
        .resolves(document)
        .withArgs(path.join(cwd, 'foo.json'))
        .resolves(`{ foo: true }`);

      await generate(path.join(cwd, 'bar.json'), {
        module: 'esm',
        fs,
        dependencies: new Dependencies(),
        path,
        traverse: new Traverse({
          skipGetters: false,
        }),
        transformExternal: source => source !== path.join(cwd, 'foo.json'),
        transformInline: () => true,
      });

      expect(fs.write.getCalls()).to.have.length(2);

      expect(fs.write.getCall(0).args[0]).to.equal('./4112716709.mjs');
      expect(fs.write.getCall(0).args[1]).to.equal(
        `import {assertValidModule, registerModule, collectPotentialError} from "json-ref-escodegen/runtime/index.mjs";
import _1021158662 from "./1021158662.mjs";
const $ = {
  get "a"() {
    assertValidModule(_1021158662)
    return _1021158662;
  }
};
export {$ as default};
const $_source = "/home/baz/project/bar.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
collectPotentialError($_errors, "#/a", () => void Reflect.get($, "a"))
`,
      );

      expect(fs.write.getCall(1).args[0]).to.equal('./1021158662.mjs');
      expect(fs.write.getCall(1).args[1]).to.equal(
        `import {registerModule} from "json-ref-escodegen/runtime/index.mjs";
const $ = Function("return ({ foo: true })")();
export {$ as default};
const $_source = "/home/baz/project/foo.json";
const $_errors = [];
registerModule($, {
  errors: $_errors,
  source: $_source
})
`,
      );
    });
  });
});
