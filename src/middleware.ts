import { CommandHandler, UserCommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  return async (cmdName, ...args) => {
    const currentUserName = readConfig().currentUserName;

    if (!currentUserName) {
      throw new Error("No user is currently logged in!");
    }

    const user = await getUserByName(currentUserName);

    if (!user) {
      throw new Error(`User ${currentUserName} not found`);
    }

    await handler(cmdName, user, ...args);
  };
}
