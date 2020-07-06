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
];
