# json-ref-escodegen

This is not yet another JSON Schema $ref resolver.
See [key differences](#key-differences) and [how does it work?](#how-does-it-work) to learn more.

## Install

```sh
yarn add json-ref-escodegen
```

or if npm is package manager of your choice

```sh
npm install json-ref-escodegen --save
```

## Key differences

- generates JS code instead of object literal supposed to be eventually serialized back to JSON / YAML / any other text format
- highly scalable - it's expected to work on projects rather than single files
- very performant - one of the quickest (if not the quickest) $ref resolver
- excellent long-term caching possibilities - each $ref is as a separate module (file)
- first-class support for all kinds of circularity
- truly environment agnostic - does not depend on any fs module or browser global
- no concept of resolvers - you are in charge of the whole reading & path parsing process
- no parser included - bring your own!
- no CLI

## Usage

```js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import generate, { Dependencies, ModuleRegistry } from 'json-ref-escodegen';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(__dirname, 'src/__fixtures__/root.json');
const dist = path.join(__dirname, 'dist/output');

const module = await generate(
  source,
  {
    module: 'esm',
    fs: {
      read: async (src) => JSON.parse(await fs.promises.readFile(src, 'utf8')),
      write: (target, content) => fs.promises.writeFile(path.join(dist, target), content),
    },
    path,
    dependencies: new Dependencies(),
    moduleRegistry: new ModuleRegistry(),
  }
);

const { default: dereferenced } = await import(path.join(dist, `${module.id}.mjs`));

console.log(dereferenced);
```

## How does it work?

json-ref-escodegen generates valid JS code for each processed document.
Each $ref is a getter pointing at external referenced module, or the same module if it's an internal ref.

### How do I serialize my crap back to other text format, such as JSON or YAML?

It's as simple as importing the generated module and running `JSON.stringify` or YAML counterpart.
I strongly recommend usage of YAML due to anchors, or a safe JSON stringifer.

## LICENSE

[Apache License 2.0](https://github.com/P0lip/json-ref-escodegen/blob/master/LICENSE)
