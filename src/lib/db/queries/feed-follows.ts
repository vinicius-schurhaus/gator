import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
  const [feedFollow] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, feedFollow.id));

  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const feedFollowsForUser = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

  return feedFollowsForUser;
}
