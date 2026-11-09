import { User } from "src/lib/db/schema";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed-follows";
import { getFeedByURL } from "src/lib/db/queries/feeds";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <url>`);
  }

  const [url] = args;

  const feed = await getFeedByURL(url);

  if (!feed) {
    throw new Error(`No feed found with URL: ${url}`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);

  console.log(`Successfully followed feed: ${feedFollow.feedName}`);
  console.log(`User: ${feedFollow.userName}`);
}

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
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
