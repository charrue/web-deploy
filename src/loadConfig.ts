import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import merge from "lodash.merge";
import { CLI_NAME } from "./helper/constants";

export const configFilename = `${CLI_NAME}.json`;

export interface DeployConfig {
  remote: string;
  platform: "gitlab";
  build: {
    script: string;
    outputDir: string;
  };
  branch: {
    release: string;
    active: string[];
  };
}

export const defaultConfig: DeployConfig = {
  platform: "gitlab",
  remote: "",
  build: {
    script: "build",
    outputDir: "dist",
  },
  branch: {
    release: "release",
    active: ["*"],
  },
};

export const loadConfig = (root: string): DeployConfig => {
  const configPath = resolve(root, configFilename);
  if (!existsSync(configFilename)) {
    return defaultConfig;
  }

  try {
    const userConfig = JSON.parse(readFileSync(configPath, {
      encoding: "utf-8",
    }));
    return merge(defaultConfig, userConfig);
  } catch (e) {
    console.error(e);
    return defaultConfig;
  }
};
