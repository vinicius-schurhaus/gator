import { getUserByID, getUserByName } from "src/lib/db/queries/users";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { readConfig } from "../config";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }

  const [name, url] = args;

  const currentUser = readConfig().currentUserName;

  if (!currentUser) {
    throw new Error("No user is currently logged in!");
  }

  const user = await getUserByName(currentUser);

  if (!user) {
    throw new Error("Unknown user!");
  }

  const feed = await createFeed(name, url, user.id);

  printFeed(user, feed);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();

  for (const feed of feeds) {
    const username = (await getUserByID(feed.userId)).name;

    console.log(`Name: ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`User: ${username}`);
  }
}

function printFeed(user: User, feed: Feed) {
  console.log("Feed:");
  console.log(`  ID: ${feed.id}`);
  console.log(`  Name: ${feed.name}`);
  console.log(`  URL: ${feed.url}`);
  console.log(`  Created At: ${feed.createdAt}`);
  console.log(`  Updated At: ${feed.updatedAt}`);

  console.log("User:");
  console.log(`  Name: ${user.name}`);
}
