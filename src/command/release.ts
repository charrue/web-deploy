import { mkdirSync, existsSync } from "fs";
import { configStore } from "../helper/configStore";
import { red } from "kolorist";
import { resolve } from "path";
import rimraf from "rimraf";
import { exec } from "../helper/exec";
import { platform } from "os";
import { toWinPath } from "../helper/index";
import { loadConfig } from "../loadConfig";

export const release = async (name?: string) => {
  if (!name) {
    if (existsSync(resolve(process.cwd(), "web-deploy.json"))) {
      name = loadConfig(process.cwd()).name;
    }
  }

  if (!name) {
    console.log(red("you should specify a project name !"));

    process.exit();
  }
  const deployConfig = configStore.get(name);

  if (!deployConfig) {
    console.log(red(`you should build ${name} first !`));

    process.exit();
  }

  const targetPath = platform() === "win32" ? toWinPath(deployConfig.release.path) : deployConfig.release.path;
  if (!existsSync(targetPath)) {
    mkdirSync(targetPath, { recursive: true });
  }
  console.log(`release ${name} to ${targetPath}`);
  process.chdir(targetPath);

  const projectPath = resolve(targetPath, name);

  if (existsSync(projectPath)) {
    process.chdir(projectPath);

    try {
      console.log("git fetch --all");
      exec("git fetch --all", projectPath);

      console.log(`git reset --hard origin/${deployConfig.branch}`);
      exec(`git reset --hard origin/${deployConfig.branch}`, projectPath);

      console.log(`git pull origin ${deployConfig.branch}`);
      exec(`git pull origin ${deployConfig.branch}`, projectPath);
    } catch (e) {
      process.chdir(targetPath);
      console.log(`rm -rf ${projectPath}`);
      rimraf.sync(projectPath);

      console.log(`git clone ${deployConfig.remote} ${name} -b ${deployConfig.branch}`);
      exec(`git clone ${deployConfig.remote} ${name} -b ${deployConfig.branch}`, targetPath);
    }
  } else {
    console.log(`git clone ${deployConfig.remote} ${name} -b ${deployConfig.branch}`);
    exec(`git clone ${deployConfig.remote} ${name} -b ${deployConfig.branch}`, targetPath);
  }
};
