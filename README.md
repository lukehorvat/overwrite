# overwrite [![NPM version](http://img.shields.io/npm/v/overwrite.svg?style=flat-square)](https://www.npmjs.org/package/overwrite)

Overwrite any file in a Node.js module on-the-fly!

## Installation

Install the package with NPM:

```bash
$ npm install overwrite
```

## Usage

As an example, consider the following code:

```javascript
import isInteger from "is-integer";

console.log(isInteger(1)); // => true
console.log(isInteger(2)); // => true
```

If you wanted to modify/tweak the functionality of the `is-integer` module (for some reason), you'd normally have two options:

1. Attempt to programmatically monkey-patch the module.
2. Fork the module and publish your changes as a separate NPM package.

This package introduces a powerful third option – overwrite specific files in the module at runtime i.e. on-the-fly! For example:

```javascript
import overwrite from "overwrite";

const isInteger = overwrite("is-integer", {
  "index.js": `
    module.exports = function(value) {
      return value === 1;
    }
  `
});

console.log(isInteger(1)); // => true
console.log(isInteger(2)); // => false
```

As can be seen, this package exposes a function that accepts a module name (string) as the first argument, and a mapping of relative file paths to file contents (object literal) as the second. The return value is, of course, the module itself with all of the overwrites applied. In this particular example, the `index.js` file in the `is-integer` module is completely overwritten with new code that behaves very differently.
