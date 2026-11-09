import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const req = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  const data = await req.text();

  const parser = new XMLParser({ processEntities: false });
  const xml = parser.parse(data);

  const channel = xml.rss?.channel;

  if (!channel) {
    throw new Error("No channel field on the RSS response!");
  }

  const title = channel.title;
  const link = channel.link;
  const description = channel.description;

  if (!title || !link || !description) {
    throw new Error("Missing fields on the RSS response!");
  }

  let items: any[] = [];

  if (channel.item) {
    if (Array.isArray(channel.item)) {
      items = channel.item;
    } else {
      items = [channel.item];
    }
  }

  const parsedItems: RSSItem[] = [];

  for (const item of items) {
    const itemTitle = item.title;
    const itemLink = item.link;
    const itemDescription = item.description;
    const itemPubDate = item.pubDate;

    if (!itemTitle || !itemLink || !itemDescription || !itemPubDate) {
      continue;
    }

    parsedItems.push({
      title: itemTitle,
      link: itemLink,
      description: itemDescription,
      pubDate: itemPubDate,
    });
  }

  return {
    channel: {
      title,
      link,
      description,
      item: parsedItems,
    },
  };
}
