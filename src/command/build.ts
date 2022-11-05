import { bold, cyan, red } from "kolorist";
import { exec } from "../helper/exec";
import { CommandContext } from "../context";

const ensureNi = () => {
  try {
    exec("ni -v");
  } catch (e) {
    console.log(`start install ${cyan("@antfu/ni")} ...`);
    console.log(exec(`npm i -g @antfu/ni`));
  }
};

export const build = ({ config, packageJson }: CommandContext) => {
  ensureNi();

  const scripts = Object.keys(packageJson.scripts || {});
  const scriptName = config.build.script;
  if (!scripts.includes(scriptName)) {
    console.log(cyan(bold(scriptName)) + red(` script not found in package.json`));
    return;
  }

  console.log(`ni ${scriptName}...\n`);
  console.log(exec(`ni ${scriptName}`));
};
