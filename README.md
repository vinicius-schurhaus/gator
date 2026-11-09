# Gator 🐊

Gator is a command-line RSS feed aggregator built with TypeScript and Node.js.

It allows users to register, follow RSS feeds, collect posts automatically, and browse the latest articles from their followed feeds.

## Features

- Register and manage users.
- Add and follow RSS feeds.
- List available feeds and followed feeds.
- Automatically fetch new posts.
- Browse the latest posts from followed feeds.
- Run continuous feed aggregation.

## Technologies

- TypeScript
- Node.js
- PostgreSQL
- Drizzle ORM

## Getting Started

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your PostgreSQL database.
4. Run the database migrations.
5. Start using the CLI:

   ```bash
   npm run start <command>
   ```

## Commands

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `register <name>`      | Create a user                     |
| `login <name>`         | Log in as a user                  |
| `users`                | List all users                    |
| `reset`                | Delete all users and related data |
| `addfeed <name> <url>` | Add and follow an RSS feed        |
| `feeds`                | List all feeds                    |
| `follow <url>`         | Follow an existing feed           |
| `following`            | List followed feeds               |
| `unfollow <url>`       | Unfollow a feed                   |
| `agg <duration>`       | Fetch posts continuously          |
| `browse [limit]`       | Display recent posts              |

## Aggregation

Run the aggregator with a time interval:

```bash
npm run start agg 1m
```

Supported units:

- `ms` — milliseconds
- `s` — seconds
- `m` — minutes
- `h` — hours

Press `Ctrl+C` to stop aggregation.

## Purpose

Gator was built to practice backend development, database management, SQL queries, and working with RSS feeds using TypeScript and PostgreSQL.
