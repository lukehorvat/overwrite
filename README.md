# overwrite [![NPM version](http://img.shields.io/npm/v/overwrite.svg?style=flat-square)](https://www.npmjs.org/package/overwrite)

Forget monkey-patching your dependencies. Completely _rewrite_ any file in a third-party package/module on-the-fly!

Works with NPM v3+; untested on earlier versions.

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

If you wanted to modify/tweak the functionality of the third-party `is-integer` module (for some reason), you'd normally have three options:

1. Attempt to programmatically monkey-patch the module.
2. Fork the module, submit a patch to the original repository, and pray that it is merged.
3. Fork the module and publish your changes as a separate NPM package.

This package introduces a powerful _fourth_ option – overwrite specific files in the module on-the-fly at runtime! For example:

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

As can be seen, this package exposes a function that accepts a module name (string) as the first argument, and a mapping (object literal) of relative file paths to file contents as the second. The return value is the module itself (as if you called `require` or `import`), but with all of the overwrites applied. In this particular example, the `index.js` file in the third-party `is-integer` package is completely overwritten with new code that behaves very differently.

## Tip

Most of the time, you probably won't want to _completely_ overwrite the contents of a file, you'll just want to change a few lines here and there. You can easily do this by simply mapping the relative file path to a transformation function (instead of a string). Here's an example:

```javascript
import overwrite from "overwrite";

const isInteger = overwrite("is-integer", {
  "index.js": contents => {
    let lines = contents.split("\n");
    lines.splice(3, 1, `console.log("Hello!");`);
    return lines.join("\n");
  }
});
```
