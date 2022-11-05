#!/usr/bin/env node
import minimist from "minimist";
import { build } from "./command/build";
import { postbuild } from "./command/postbuild";
import { createCommandContext } from "./context";
import { config } from "./command/config";

const init = () => {
  const argv = minimist(process.argv.slice(2), {});
  const command = argv._[0];
  const context = createCommandContext();

  if (command === "config") {
    config(context);
  }
  if (command === "build") {
    build(context);
  }
  if (command === "postbuild") {
    postbuild(context);
  }
};

init();
