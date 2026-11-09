import {
  CommandsRegistry,
  handlerLogin,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { setUser, readConfig } from "./config";
import { argv } from "node:process";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  const command = argv.slice(2, 3).toString();
  const args = argv.slice(3);

  if (!command) {
    console.error("No command provided.");
    process.exit(1);
  }

  if (args.length === 0) {
    console.error("No argument provided.");
    process.exit(1);
  }

  runCommand(registry, command, ...args);
}

main();
