import { resolve } from "path";
import { existsSync } from "fs";
import { red } from "kolorist";
import { ensureNi } from "../helper/index";
import { configStore } from "../helper/configStore";
import { exec } from "../helper/exec";
import { loadConfig } from "../loadConfig";

export const init = (remoteUrl: string) => {
  const root = process.cwd();

  const startRepo = (repoDir: string) => {
    // 确保ni安装了
    ensureNi(root);

    console.log(`start install dependencies ...`);
    exec("ni", repoDir);

    // 读取配置文件
    const configFilePath = resolve(repoDir, "web-deploy.json");
    if (!existsSync(configFilePath)) {
      console.log(red(`cannot find ${configFilePath}. You should 'web-deploy init-config' first.`));
      process.exit();
    }
    console.log(`start load ${repoDir} config ...`);
    const config = loadConfig(repoDir);

    // 保存配置
    configStore.init();
    configStore.set(config.name, config);
  };

  if (remoteUrl) {
    const repoName = remoteUrl.split("/").pop()?.replace(".git", "");
    if (!repoName) {
      console.log(red(`invalid remote url: ${remoteUrl}`));
      process.exit();
    }

    const repoPath = resolve(root, repoName);
    if (existsSync(repoPath)) {
      exec(`git pull origin master`, repoPath);
      startRepo(repoPath);
    } else {
      console.log(`start clone repo ...`);
      exec(`git clone ${remoteUrl}`, root);

      startRepo(repoPath);
    }
  } else {
    startRepo(root);
  }
};
