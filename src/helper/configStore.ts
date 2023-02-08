import { resolve } from "path";
import { homedir } from "os";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { DeployConfig } from "../loadConfig";

export const createStore = () => {
  const storePath = resolve(homedir(), ".web-deploy");
  const storeFilePath = resolve(storePath, "store.json");

  const getAll = (): Record<string, DeployConfig> => {
    const currentStoreConfig = readFileSync(storeFilePath, {
      encoding: "utf-8",
    });

    const storeConfig = JSON.parse(currentStoreConfig);

    return storeConfig;
  };

  return {
    storeFilePath,
    init: () => {
      if (!existsSync(storePath)) {
        mkdirSync(storePath);
      }

      if (!existsSync(storeFilePath)) {
        writeFileSync(storeFilePath, JSON.stringify({}));
      }
    },

    getAll,

    get: (name: string): DeployConfig => {
      const storeConfig = getAll();

      return storeConfig[name];
    },

    set: (name: string, config: DeployConfig) => {
      const storageKey = config.storageKey || name;
      const storeConfig = getAll();
      storeConfig[storageKey] = config;
      writeFileSync(storeFilePath, JSON.stringify(storeConfig, null, 2));
    },
  };
};

export const configStore = createStore();
