import { readConfig } from "src/config";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed-follows";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { getUserByName } from "src/lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <url>`);
  }

  const [url] = args;

  const feed = await getFeedByURL(url);

  if (!feed) {
    throw new Error(`No feed found with URL: ${url}`);
  }

  const { currentUserName } = readConfig();

  if (!currentUserName) {
    throw new Error(
      "You must be logged in to follow a feed. Run the login command first.",
    );
  }

  const user = await getUserByName(currentUserName);

  if (!user) {
    throw new Error(`User "${currentUserName}" was not found in the database.`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);

  console.log(`Successfully followed feed: ${feedFollow.feedName}`);
  console.log(`User: ${feedFollow.userName}`);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  const { currentUserName } = readConfig();

  if (!currentUserName) {
    throw new Error(
      "You must be logged in to see your followed feeds. Run the login command first.",
    );
  }

  const user = await getUserByName(currentUserName);

  if (!user) {
    throw new Error(`User "${currentUserName}" was not found in the database.`);
  }

  const feedFollows = await getFeedFollowsForUser(user.id);

  if (feedFollows.length === 0) {
    console.log(`User "${user.name}" is not following any feeds.`);
    return;
  }

  console.log(`Feeds followed by ${user.name}:`);

  for (const feed of feedFollows) {
    console.log(`  - ${feed.feedName}`);
  }
}
