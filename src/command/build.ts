import { createCommandContext } from "../context";
import { resolve } from "path";
import { cyan, red } from "kolorist";
import { existsSync } from "fs";
import SimpleGit from "simple-git";
import { exec } from "../helper/exec";
import rimraf from "rimraf";
import { spawnSync } from "child_process";

const git = SimpleGit();

const formatTime = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = `${currentDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${currentDate.getDate()}`.padStart(2, "0");
  const hour = `${currentDate.getHours()}`.padStart(2, "0");
  const minute = `${currentDate.getMinutes()}`.padStart(2, "0");
  const second = `${currentDate.getSeconds()}`.padStart(2, "0");

  return `${year}_${month}_${day}__${hour}_${minute}_${second}`;
};

export const build = async () => {
  const context = createCommandContext();

  const { root, config } = context;

  const remoteUrl = config.remote;
  const { outputDir } = config.build;
  const buildScript = config.build.script;
  const targetBranchName = config.branch.release || "master";

  // 确保设置了远程仓库地址
  if (!remoteUrl) {
    console.log(red(`you should set 'remote' config.`));
    process.exit();
  }

  console.log(cyan(`npm run ${buildScript}...`));

  // 执行构建命令
  exec(`npm run ${buildScript}`, root);

  // 确保构建成功
  const distDir = resolve(root, outputDir);
  if (!existsSync(distDir)) {
    console.log(red(`cannot find ${outputDir} dir. You should 'npm run ${buildScript}' first.`));
    process.exit();
  }

  // 进入构建目录
  console.log(`cd ${distDir}`);
  process.chdir(distDir);

  // 删除.git文件夹
  const gitPath = resolve(distDir, ".git");
  if (existsSync(gitPath)) {
    rimraf.sync(gitPath);
    console.log(`rm -rf ${outputDir}/.git`);
  }

  // 初始化git
  console.log("git init");
  exec("git init", distDir);
  console.log("git add -A");
  exec("git add -A", distDir);

  console.log("git commit -m 'build: release'");
  spawnSync("git", ["commit", "-m", "build: release"], { stdio: "inherit", cwd: distDir });
  const currentBranchName = await (await git.branchLocal()).current;
  if (currentBranchName !== targetBranchName) {
    exec(`git checkout -b ${targetBranchName} ${currentBranchName}`, distDir);
    console.log(`git checkout -b ${targetBranchName} ${currentBranchName}`);
  }

  // 添加tag
  const tagName = `RELEASE__${formatTime()}`;
  exec(`git tag ${tagName}`, distDir);

  // 添加临时远程仓库
  const tmpRemoteName = `tmp_remote_${formatTime()}`;
  exec(`git remote add ${tmpRemoteName} ${remoteUrl}`, distDir);
  console.log(`git remote add ${tmpRemoteName} ${remoteUrl}`);

  // 强制推送到远程 + 推动tag
  exec(`git push ${tmpRemoteName} ${targetBranchName} --force --tags`, distDir);
  console.log(`git push ${tmpRemoteName} ${targetBranchName} --force --tags`);
};
