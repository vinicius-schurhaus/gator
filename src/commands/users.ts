import {
  createUser,
  deleteAllUsers,
  getUserByName,
  getUsers,
} from "src/lib/db/queries/users";
import { readConfig, setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const username = args[0];

  if ((await getUserByName(username)) == undefined) {
    throw new Error(`User ${username} doesn't exist!`);
  }

  setUser(username);
  console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const username = args[0];

  if (await getUserByName(username)) {
    throw new Error("User already exists!");
  }

  await createUser(username);

  setUser(username);
  console.log(`User ${username} created successfully!`);
}

export async function handlerReset() {
  await deleteAllUsers();
  console.log("Users table has been successfully reset.");
}

export async function handlerUsers() {
  const users = await getUsers();
  const currentUser = readConfig().currentUserName;

  for (const user of users) {
    if (user.name === currentUser) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}
