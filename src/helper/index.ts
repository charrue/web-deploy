import { cyan } from "kolorist";
import { exec } from "./exec";

export const ensureNi = (root: string) => {
  try {
    exec("ni -v", root);
  } catch (e) {
    console.log(`start install ${cyan("@antfu/ni")} ...`);
    console.log(exec("npm install -g @antfu/ni"), root);
  }
};

const RE_POSIX_DEVICE_ROOT = /^\/([A-Za-z])\//;

export const toWinPath = (p: string) => {
  const parts = RE_POSIX_DEVICE_ROOT.exec(p);
  if (parts) {
    const device = `${parts[1]}:\\`;
    return p.replace(RE_POSIX_DEVICE_ROOT, device).replace(/\//g, "\\");
  }

  return p;
};
