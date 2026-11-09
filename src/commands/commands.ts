import { setUser } from "src/config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function handlerLogin(cmdName: string, ...args: string[]) {
  if ([...args].length === 0) {
    throw new Error("A username is required.");
  }

  if ([...args].length > 1) {
    throw new Error("You must provide a single username.");
  }

  const username = args[0];

  setUser(username);

  console.log(`${username} has been set.`);
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  if (!cmdName) {
    throw new Error("No command name provided.");
  }

  if (!handler) {
    throw new Error("No function provided.");
  }

  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  if (cmdName in registry) {
    registry[cmdName](cmdName, ...args);
  }
}
