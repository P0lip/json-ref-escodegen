'use strict';
const mocha = require('mocha');
const chai = require('chai');
const chaiSnapshot = require('mocha-chai-snapshot');
const path = require('path');
const fs = require('fs');

const {
  default: generate,
  Dependencies,
  Traverse,
} = require('../../dist/index.cjs');

const { describe, it, beforeEach, afterEach } = mocha;
const { expect } = chai;

chai.use(chaiSnapshot);

describe('Runtime', function () {
  const tmp = path.join(__dirname, '__tmp__');
  const _fs = {
    read: async src => JSON.parse(await fs.promises.readFile(src, 'utf8')),
    write: (target, content) =>
      fs.promises.writeFile(path.join(tmp, target), content),
  };

  beforeEach(async () => {
    await fs.promises.mkdir(tmp);
  });

  afterEach(async () => {
    await fs.promises.rmdir(tmp, { recursive: true });
  });

  describe('root.json fixture', function () {
    it('generates valid code', async function () {
      const source = path.join(__dirname, '__fixtures__/root.json');

      const { id } = await generate(source, {
        module: 'cjs',
        fs: _fs,
        path,
        dependencies: new Dependencies(),
        traverse: new Traverse({
          skipGetters: false,
        }),
        transformExternal: () => true,
        transformInline: () => true,
      });

      expect(require(`${tmp}/${id}.cjs`)).to.matchSnapshot(this);
    });
  });
});
