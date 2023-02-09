import { loadConfig } from "../loadConfig";
import { resolve } from "path";
import { existsSync } from "fs";
import { configStore } from "../helper/configStore";
import { cyan } from "kolorist";

export const updateConfig = (root: string = process.cwd()) => {
  const configFilePath = resolve(root, "web-deploy.json");
  if (
    !existsSync(configFilePath)
  ) {
    console.log("web-deploy.json not found");
    process.exit(1);
  }

  const config = loadConfig(root);

  configStore.set(config.name, config);
  console.log(cyan(`config file ${config.name} updated.`));
};
