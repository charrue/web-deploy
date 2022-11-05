import { dirname } from "path";
import { red } from "kolorist";
import { PackageJson } from "type-fest";
import { findUp, readJson } from "@charrue/node-toolkit";
import { DeployConfig, loadConfig } from "./loadConfig";
import { existsSync } from "fs";

export interface CommandContext {
  root: string;
  config: DeployConfig;
  packageJson: PackageJson;
}

export const createCommandContext = () => {
  const cwd = process.cwd();

  const packageJsonPath = findUp("package.json", {
    cwd,
  });

  if (!existsSync(packageJsonPath)) {
    console.log(red(`read ${packageJsonPath} error.`));
    process.exit();
  }

  const packageJson: PackageJson = readJson(packageJsonPath);
  if (!packageJson) {
    console.log(red(`resolve package.json error.`));
    process.exit();
  }

  const root = dirname(packageJsonPath);
  const config = loadConfig(root);

  return {
    root,
    config,
    packageJson,
  };
};
