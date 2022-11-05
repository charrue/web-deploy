import { execSync } from "child_process";

export const exec = (cmd: string, cwd: string = process.cwd(), log = false) => {
  if (log) {
    console.log(cmd);
  }

  return execSync(cmd, {
    cwd,
    stdio: ["pipe", "pipe", "pipe"],
  }).toString();
};
