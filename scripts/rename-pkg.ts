import { readJson, writeJson } from "@charrue/node-toolkit";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { CLI_NAME } from "../src/helper/constants";

const PKG_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "../package.json");

const pkgJson = readJson(PKG_PATH);

if (pkgJson.name !== CLI_NAME) {
  const newPkgJson = {
    ...pkgJson,
    name: CLI_NAME,
    bin: {
      [CLI_NAME]: "./dist/index.cjs",
    },
  };

  writeJson(PKG_PATH, newPkgJson, {
    space: 2,
  });
}
