import path from "path";
import { expect, test } from "vitest";
import { resolveGitlabCIConfig } from "../src/helper/resolve-gitlab-ci";

test("resolve gitlab ci config", () => {
  const configFile = path.resolve(__dirname, "./mock/.gitlab-ci.yml");
  resolveGitlabCIConfig(configFile);
  expect(true).toBe(true);
});
