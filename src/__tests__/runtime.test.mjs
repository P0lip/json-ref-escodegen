import mocha from 'mocha';
import chai from 'chai';
import chaiSnapshot from 'mocha-chai-snapshot';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import generate, { Dependencies, Traverse } from '../index.mjs';
import { InvalidPointerError } from '../runtime/errors/pointers.mjs';
import { getModuleErrors } from '../runtime/modules/core.mjs';

const { describe, it, beforeEach, afterEach } = mocha;
const { expect } = chai;

chai.use(chaiSnapshot);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
        module: 'esm',
        fs: _fs,
        path,
        dependencies: new Dependencies(),
        traverse: new Traverse({
          skipGetters: false,
        }),
        transformExternal: () => true,
        transformInline: () => true,
      });

      expect((await import(`${tmp}/${id}.mjs`)).default).to.matchSnapshot(this);
    });
  });

  describe('error handling', () => {
    it('detects invalid pointers', async function () {
      const source = path.join(__dirname, '__fixtures__/invalid-pointer.json');

      const { id } = await generate(source, {
        module: 'esm',
        fs: _fs,
        path,
        dependencies: new Dependencies(),
        traverse: new Traverse({
          skipGetters: false,
        }),
        transformExternal: () => true,
        transformInline: () => true,
      });

      const module = (await import(`${tmp}/${id}.mjs`)).default;
      const errors = getModuleErrors(module);

      expect(errors).to.have.length(3);
      expect(errors[0]).to.be.instanceOf(InvalidPointerError).and.to.include({
        path: '#/properties/name',
        message:
          'Pointer pointing at other property than root needs to start with #/',
      });
      expect(errors[1]).to.be.instanceOf(InvalidPointerError).and.to.include({
        path: '#/properties/age',
        message: 'Pointer cannot be empty',
      });
      expect(errors[2]).to.be.instanceOf(InvalidPointerError).and.to.include({
        path: '#/properties/address',
        message: 'Pointer should be a string',
      });
    });
  });
});
