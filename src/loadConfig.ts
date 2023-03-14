import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import merge from "lodash.merge";
import { CLI_NAME } from "./helper/constants";

export const configFilename = `${CLI_NAME}.json`;

export interface DeployConfig {
  name: string;
  remote: string;
  storageKey?: string;
  platform: "gitlab";
  build: {
    script: string;
    outputDir: string;
  };
  release: {
    path: string;
  };
  branch: {
    active: string;
    release: string;
  };
}

export const defaultConfig: DeployConfig = {
  name: "",
  platform: "gitlab",
  remote: "",
  build: {
    script: "build",
    outputDir: "dist",
  },
  release: {
    path: "/opt/www",
  },
  branch: {
    active: "master",
    release: "release",
  },
};

export const loadConfig = (root: string): DeployConfig => {
  const configPath = resolve(root, configFilename);
  if (!existsSync(configPath)) {
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
