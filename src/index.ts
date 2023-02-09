#!/usr/bin/env node
import minimist from "minimist";
import { initConfig } from "./command/init-config";
import { build } from "./command/build";
import { release } from "./command/release";
import { init } from "./command/init";
import { updateConfig } from "./command/update-config";

const start = () => {
  const argv = minimist(process.argv.slice(2), {});
  const command = argv._[0];
  argv.$0 = "web-deploy";

  if (!command) {
    console.log(`Usage: ${argv.$0} <command>`);
    console.log(`Commands:`);
    console.log(`  init-config`);
    console.log(`  update-config`);
    console.log(`  init <remote-url>`);
    console.log(`  build`);
    console.log(`  release <name>`);
    return;
  }

  if (command === "init-config") {
    initConfig();
  }
  if (command === "update-config") {
    updateConfig();
  }
  if (command === "init") {
    const remoteUrl = argv._[1];
    init(remoteUrl);
  }
  if (command === "build") {
    build();
  }
  if (command === "release") {
    const name = argv._[1];
    release(name);
  }
};

start();
