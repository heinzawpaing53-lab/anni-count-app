import { spawn } from "node:child_process";

const children = [];

function start(name, args) {
  const command =
    process.platform === "win32"
      ? ["cmd.exe", ["/d", "/s", "/c", "npm", ...args]]
      : ["npm", args];

  const child = spawn(command[0], command[1], {
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      shutdown(code ?? 1);
    }
  });

  children.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

start("server", ["run", "server"]);
start("client", ["run", "dev:client"]);
