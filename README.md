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
- very performant - one of the quickest (if not the quickest) $ref resolver (despite the whole fairly expensive code generation process that takes place - will be even faster when there is plain resolving mode exposed)
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
import generate, { Dependencies, Traverse } from 'json-ref-escodegen';

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
    traverse: new Traverse({
      skipGetters: false,
    }),
    transformExternal: (target) => true,
    transformInternal: (pointer) => true,
  }
);

const { default: dereferenced } = await import(path.join(dist, `${module.id}.mjs`));

console.log(dereferenced);
```

## How does it work?

json-ref-escodegen generates valid JS code for each processed document.
Each $ref is a getter pointing at external referenced module, or the same module if it's an internal ref.

### Example output

- `index.json`

```json
{
  "allOf": [
    {
      "$ref": "./users.json#"
    },
    {
      "$ref": "./user.json#/properties/name"
    },
    {
      "$ref": "./user.json#/properties/age"
    }
  ]
}
```

- `user.josn`

```json
{
  "title": "User",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The user's full name."
    },
    "age": {
      "type": "number",
      "minimum": 0,
      "maximum": 150
    }
  }
}
```

- `users.json`

```json
{
  "type": "array",
  "items": {
    "$ref": "./user.json#"
  },
  "minItems": 1
}
```

- `37043355.mjs` - this is the output for `index.json`

```js
import {default as _3899215387} from "./3899215387.mjs";
import {default as _3073295516} from "./3073295516.mjs";
const $ = {
  "allOf": Object.defineProperties([{
    "$ref": "./users.json#"
  }, {
    "$ref": "./user.json#/properties/name"
  }, {
    "$ref": "./user.json#/properties/age"
  }], {
    0: {
      configurable: true,
      enumerable: true,
      get() {
        return _3899215387;
      }
    },
    1: {
      configurable: true,
      enumerable: true,
      get() {
        return _3073295516["properties"]["name"];
      }
    },
    2: {
      configurable: true,
      enumerable: true,
      get() {
        return _3073295516["properties"]["age"];
      }
    }
  })
};
export {$ as default};
```

- `3073295516.mjs` - `user.json`

```js
const $ = {
  "title": "User",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The user's full name."
    },
    "age": {
      "type": "number",
      "minimum": 0,
      "maximum": 150
    }
  }
};
export {$ as default};
```

- `3899215387.mjs` - `users.json`

```js
import {default as _3073295516} from "./3073295516.mjs";
const $ = {
  "type": "array",
  get "items"() {
    return _3073295516;
  },
  "minItems": 1
};
export {$ as default};
```

### How do I serialize my crap back to other text format, such as JSON or YAML?

It's as simple as importing the generated module and running `JSON.stringify` or YAML counterpart.
I strongly recommend usage of YAML due to anchors, or a safe JSON stringifer.

## LICENSE

[Apache License 2.0](https://github.com/P0lip/json-ref-escodegen/blob/master/LICENSE)
