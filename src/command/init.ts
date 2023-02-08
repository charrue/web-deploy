/* eslint-disable max-statements */
import { CommandContext } from "../context";
import { resolve } from "path";
import { existsSync } from "fs";
import { cyan, red } from "kolorist";
import { ensureNi } from "../helper/index";
import { configStore } from "../helper/configStore";
import { exec } from "../helper/exec";

export const init = (context: CommandContext) => {
  const { root, config } = context;
  const configFilePath = resolve(root, "web-deploy.json");
  if (!existsSync(configFilePath)) {
    console.log(red(`cannot find ${configFilePath}. You should 'web-deploy init-config' first.`));
    process.exit();
  }

  // 确保ni安装了
  ensureNi(root);

  console.log(`start install dependencies ...`);
  exec("ni");

  // 保存配置
  configStore.init();
  configStore.set(config.name, config);

  console.log(`save config to ${cyan(configStore.storeFilePath)}`);
};
