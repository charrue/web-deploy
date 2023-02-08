#!/usr/bin/env node
/* eslint-disable max-statements */
import minimist from "minimist";
import { createCommandContext } from "./context";
import { initConfig } from "./command/init-config";
import { build } from "./command/build";
import { release } from "./command/release";
import { init } from "./command/init";
import { updateConfig } from "./command/update-config";

const start = () => {
  const argv = minimist(process.argv.slice(2), {});
  const command = argv._[0];
  argv.$0 = "web-deploy";
  const context = createCommandContext();

  if (!command) {
    console.log(`Usage: ${argv.$0} <command>`);
    console.log(`Commands:`);
    console.log(`  init-config`);
    console.log(`  update-config`);
    console.log(`  init`);
    console.log(`  build`);
    console.log(`  release`);
    return;
  }

  if (command === "init-config") {
    initConfig(context);
  }
  if (command === "update-config") {
    updateConfig(context.root);
  }
  if (command === "init") {
    init(context);
  }
  if (command === "build") {
    build(context);
  }
  if (command === "release") {
    const name = argv._[1];
    release(name);
  }
};

start();