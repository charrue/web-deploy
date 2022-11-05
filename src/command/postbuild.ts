/* eslint-disable max-statements */
import { existsSync } from "fs";
import { red } from "kolorist";
import { resolve } from "path";
import shell from "shelljs";
import { spawnSync } from "child_process";
import micromatch from "micromatch";
import { exec } from "../helper/exec";
import { CommandContext } from "../context";

const getCurrentBranchName = () => exec(`git symbolic-ref --short -q HEAD`) || "master";
const formatTime = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = `${currentDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${currentDate.getDate()}`.padStart(2, "0");
  const hour = `${currentDate.getHours()}`.padStart(2, "");
  const minute = `${currentDate.getMinutes()}`.padStart(2, "");
  const second = `${currentDate.getSeconds()}`.padStart(2, "");

  return `${year}.${month}.${day}_${hour}.${minute}.${second}`;
};

export const postbuild = ({ root, config, packageJson }: CommandContext) => {
  if (!config.remote) {
    console.log(red(`you should set 'remote' config.`));
    process.exit();
  }
  const currentBranch = getCurrentBranchName();
  if (!micromatch.isMatch(currentBranch, config.branch.active)) {
    console.log(`current branch: ${currentBranch} can not emit ci`);
    return;
  }

  const { outputDir } = config.build;
  const distDir = resolve(root, outputDir);
  if (!existsSync(distDir)) {
    throw new Error(`cannot find ${outputDir} dir.`);
  }

  shell.cd(distDir);
  console.log(`cd ${distDir}`);
  const gitPath = resolve(distDir, ".git");
  if (existsSync(gitPath)) {
    shell.rm("-rf", gitPath);
    console.log(`rm -rf ${gitPath}`);
  }

  exec(`git init`, distDir, true);
  exec(`git add -A .`, distDir, true);

  console.log("git commit -m build: release");
  spawnSync("git", ["commit", "-m", "build: release"], {
    cwd: distDir,
  });

  if (currentBranch !== config.branch.release) {
    exec(`git checkout -b ${config.branch.release}`, distDir, true);
  }

  const tagName = `${packageJson.version}_${formatTime()}`;
  const lastCommitMessage = exec("git show -s --format=%B").toString().trim();
  const lastCommitHash = exec("git show -s --format=%H").toString().trim();
  const tagMessage = `(${currentBranch})最新一条提交记录(${lastCommitHash})为: ${lastCommitMessage}`;

  console.log(`git tag -a ${tagName} -m ${tagMessage}`);
  spawnSync("git", ["tag", "-a", tagName, "-m", tagMessage], {
    cwd: distDir,
  });

  const remoteName = `deploy-remote-${Date.now()}`;
  exec(`git remote add ${remoteName} ${config.remote}`, distDir, true);
  exec(`git push -f ${remoteName} ${config.branch.release}`, distDir, true);
  exec(`git push ${remoteName} --tags`, distDir, true);
};
