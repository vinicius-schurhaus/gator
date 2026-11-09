import { fetchFeed } from "src/lib/rss";

export async function handlerAgg() {
  const res = await fetchFeed("https://www.wagslane.dev/index.xml");
  const data = JSON.stringify(res);

  console.log(data);
}
