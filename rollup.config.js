import * as fs from 'fs';
import { extname, basename } from 'path';
import babel from '@rollup/plugin-babel';

import pkg from './package.json';

export default [
  {
    acorn: {
      ecmaVersion: 'latest',
    },
    external: Object.keys(pkg.dependencies),
    input: './src/index.mjs',
    output: {
      exports: 'named',
      file: './dist/index.cjs',
      format: 'cjs',
    },
    plugins: [babel({ babelHelpers: 'inline' })],
  },
  ...fs
    .readdirSync('./src/runtime')
    .filter(filepath => extname(filepath) === '.mjs')
    .map(filepath => ({
      input: `./src/runtime/${filepath}`,
      output: {
        exports: 'auto',
        file: `./dist/runtime/${basename(filepath, '.mjs')}.cjs`,
        format: 'cjs',
      },
      plugins: [babel({ babelHelpers: 'inline' })],
    })),
];
