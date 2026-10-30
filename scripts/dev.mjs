import { spawn } from "node:child_process";

const input = process.argv.slice(2);
const args = ["node_modules/next/dist/bin/next", "dev", "--webpack"];
for (let index = 0; index < input.length; index++) {
  if (input[index] === "--strictPort") continue;
  args.push(input[index] === "--host" ? "--hostname" : input[index]);
}
const child = spawn(process.execPath, args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
