import * as fs from 'fs';
import { extname, basename } from 'path';

import pkg from './package.json';

export default [
  {
    external: Object.keys(pkg.dependencies),
    input: './src/index.mjs',
    output: {
      exports: 'named',
      file: './dist/index.cjs',
      format: 'cjs',
      name: pkg.name,
    },
  },
  ...fs
    .readdirSync('./src/runtime')
    .filter(filepath => extname(filepath) === '.mjs')
    .map(filepath => ({
      input: `./src/runtime/${filepath}`,
      output: {
        exports: 'default',
        file: `./src/runtime/${basename(filepath, '.mjs')}.cjs`,
        format: 'cjs',
      },
    })),
];
