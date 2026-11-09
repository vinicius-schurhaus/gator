import { asc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
  const [feed] = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
  return feed;
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByURL(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}

export async function markFeedFetched(id: string) {
  const [feed] = await db
    .update(feeds)
    .set({ lastFetchedAt: new Date() })
    .where(eq(feeds.id, id));

  return feed;
}

export async function getNextFeedToFetch() {
  const [feed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
    .limit(1);

  return feed;
}
