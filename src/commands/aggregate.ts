import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost, getPostsForUser } from "src/lib/db/queries/posts";
import { fetchFeed } from "src/lib/rss";
import { User } from "src/lib/db/schema";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeBetweenRequests = parseDuration(args[0]);

  console.log(`Collecting feeds every ${args[0]}`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();

  if (!feed) {
    return;
  }

  const parsedFeed = await fetchFeed(feed.url);

  await markFeedFetched(feed.id);

  for (const item of parsedFeed.channel.item) {
    const publishedAt = new Date(item.pubDate);

    if (isNaN(publishedAt.getTime())) {
      console.error(`Invalid publication date: ${item.pubDate}`);
      continue;
    }

    await createPost(
      item.title,
      item.link,
      item.description ?? null,
      publishedAt,
      feed.id,
    );

    console.log(`Saved post: ${item.title}`);
  }
}

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error("Invalid duration format. Use ms, s, m or h.");
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    default:
      throw new Error("Unsupported duration unit.");
  }
}

function handleError(error: unknown) {
  console.error("Error scraping feeds:", error);
}

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length > 1) {
    throw new Error(`usage: ${cmdName} [limit]`);
  }

  const limit = args.length === 1 ? Number(args[0]) : 2;

  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error("Limit must be a positive integer.");
  }

  const posts = await getPostsForUser(user.id, limit);

  for (const post of posts) {
    console.log(`Title: ${post.title}`);
    console.log(`URL: ${post.url}`);
    console.log(`Description: ${post.description ?? ""}`);
    console.log(`Published At: ${post.publishedAt}`);
    console.log("--------------------");
  }
}
