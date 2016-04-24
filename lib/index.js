import fs from "fs";
import path from "path";
import copyDir from "copy-dir";
import isFunction from "lodash.isfunction";
import rimraf from "rimraf";
import pkg from "../package.json";
export default overwrite;

const MODULES_DIR = __filename.slice(0, __filename.lastIndexOf("node_modules") + "node_modules".length);

function overwrite(moduleName, files) {
  let moduleDir = getModuleDir(moduleName);
  let newModuleDir = getNewModuleDir(moduleName);

  rimraf.sync(newModuleDir);
  copyDir.sync(moduleDir, newModuleDir);

  Object.keys(files).forEach(filename => {
    let transform = files[filename];
    let contents = fs.readFileSync(path.resolve(moduleDir, filename), "utf8");
    let newContents = isFunction(transform) ? transform(contents) : transform;
    fs.writeFileSync(path.resolve(newModuleDir, filename), newContents, "utf8");
  });

  return require(newModuleDir);
}

function getNewModuleDir(moduleName) {
  return path.resolve(MODULES_DIR, `.${pkg.name}`, moduleName);
}

function getModuleDir(moduleName) {
  try {
    let moduleDir = path.resolve(MODULES_DIR, moduleName);
    require.resolve(moduleDir);
    return moduleDir;
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
      throw err;
    }
  }

  try {
    let parentModulePath = module.parent.filename.slice(MODULES_DIR.length + path.sep.length);
    let parentModuleName = parentModulePath.slice(0, parentModulePath.indexOf(path.sep));
    let moduleDir = path.resolve(MODULES_DIR, parentModuleName, "node_modules", moduleName);
    require.resolve(moduleDir);
    return moduleDir;
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
      throw err;
    }
  }

  throw new Error(`Cannot find module "${moduleName}".`);
}
