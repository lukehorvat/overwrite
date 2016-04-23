import fs from "fs";
import path from "path";
import copyDir from "copy-dir";
import isFunction from "lodash.isfunction";
import rimraf from "rimraf";
import pkg from "../package.json";

export default function(moduleName, files) {
  let moduleMainFile = require.resolve(moduleName);
  let modulesDir = moduleMainFile.substring(0, moduleMainFile.lastIndexOf("node_modules") + "node_modules".length);
  let oldModuleDir = path.resolve(modulesDir, moduleName);
  let newModuleDir = path.resolve(modulesDir, `.${pkg.name}`, moduleName);

  rimraf.sync(newModuleDir);
  copyDir.sync(oldModuleDir, newModuleDir);

  Object.keys(files).forEach(filename => {
    let transform = files[filename];
    let oldContents = fs.readFileSync(path.resolve(oldModuleDir, filename), "utf8");
    let newContents = isFunction(transform) ? transform(oldContents) : transform;
    fs.writeFileSync(path.resolve(newModuleDir, filename), newContents, "utf8");
  });

  return require(newModuleDir);
}
