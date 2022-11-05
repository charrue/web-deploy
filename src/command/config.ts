import { writeJson } from "@charrue/node-toolkit";
import { resolve } from "path";
import { cyan } from "kolorist";
import { defaultConfig, configFilename } from "../loadConfig";
import { CommandContext } from "../context";
import { CLI_NAME } from "../helper/constants";

export const config = ({ root, packageJson }: CommandContext) => {
  writeJson(resolve(root, configFilename), defaultConfig, {
    space: 2,
  });
  console.log(`config file ${cyan(configFilename)} created.`);

  const prefix = CLI_NAME;
  const buildScript = `${prefix}:build`;
  const postBuildScript = `post${prefix}:build`;

  const newPkgJson = {
    ...packageJson,
    scripts: {
      ...packageJson.scripts,
      [buildScript]: `${CLI_NAME} build`,
      [postBuildScript]: `${CLI_NAME} postbuild`,
    },
  };

  writeJson(
    resolve(root, "package.json"),
    newPkgJson,
    {
      space: 2,
    },
  );

  console.log(`add script: '${cyan(buildScript)}', ${cyan(buildScript)} to package.json .`);
};
