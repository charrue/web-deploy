import { DeployConfig } from "../loadConfig";

export interface CommandContext {
  root: string;
  config: DeployConfig;
}
