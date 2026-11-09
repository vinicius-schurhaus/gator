import { getUserByID } from "src/lib/db/queries/users";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { Feed, User } from "src/lib/db/schema";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }

  const [name, url] = args;

  const feed = await createFeed(name, url, user.id);

  await createFeedFollow(user.id, feed.id);

  console.log(`Feed "${feed.name}" added successfully!`);
  console.log(`User "${user.name}" is now following this feed.`);

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
