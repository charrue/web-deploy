import { writeJson } from "@charrue/node-toolkit";
import { resolve } from "path";
import { cyan } from "kolorist";
import { defaultConfig, configFilename } from "../loadConfig";
import { createCommandContext } from "../context";
import SimpleGit from "simple-git";

const git = SimpleGit();

export const initConfig = async () => {
  const context = createCommandContext();
  const { root, packageJson } = context;

  const userConfig = defaultConfig;
  userConfig.name = packageJson.name || "";
  // get remote url
  const remotes = await git.getRemotes(true);
  const origin = remotes.find((remote) => remote.name === "origin");
  if (origin) {
    userConfig.remote = origin.refs.fetch;
  }

  writeJson(resolve(root, configFilename), userConfig, {
    space: 2,
  });
  console.log(`config file ${cyan(configFilename)} created.`);
};
