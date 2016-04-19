import fs from "fs";
import path from "path";
import copyDir from "copy-dir";
import tempfile from "tempfile";

export default function(moduleName, files) {
  let oldDir = path.dirname(require.resolve(moduleName));
  let newDir = tempfile();
  copyDir.sync(oldDir, newDir);

  files.forEach(file => {
    // let oldFileContents = fs.readFileSync(path.resolve(oldDir, file.relativePath), "utf8");
    fs.writeFileSync(path.resolve(newDir, file.relativePath), file.contents, "utf8")
  });

  return require(newDir);
}
