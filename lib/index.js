import fs from "fs";
import path from "path";
import copyDir from "copy-dir";
import isString from "is-string";
import tempfile from "tempfile";

export default function(moduleName, files) {
  let oldDir = path.dirname(require.resolve(moduleName));
  let newDir = tempfile();
  copyDir.sync(oldDir, newDir);

  Object.keys(files).forEach(filename => {
    let transform = files[filename];
    let oldContents = fs.readFileSync(path.resolve(oldDir, filename), "utf8");
    let newContents = isString(transform) ? transform : transform(oldContents);
    fs.writeFileSync(path.resolve(newDir, filename), newContents, "utf8")
  });

  fs.symlinkSync(path.dirname(oldDir), path.resolve(newDir, "node_modules"));

  return require(newDir);
}
