# DE Prep Hub

A personal Data Engineering preparation website built with Next.js. Organize your study notes as markdown files, track progress locally, and search across all topics.

## Features

- **Markdown notes** — Edit content in `content/` as `.md` files
- **8 study topics** — SQL, Python, Spark, Databricks, Airflow, Cloud, System Design, Interview Prep
- **Learning roadmap** — Structured path page at `/roadmap`
- **Dark / light mode** — Theme toggle with system preference support
- **Search** — Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to search all topics
- **Progress tracking** — Mark topics complete; progress saved in browser localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Notes

### Topic notes

Edit any file in `content/topics/`:

```
content/topics/sql.md
content/topics/python.md
content/topics/spark.md
content/topics/databricks.md
...
```

Each file uses frontmatter:

```md
---
title: SQL & Databases
description: SQL fundamentals, queries, and database concepts
order: 1
---

Your notes go here. Supports **markdown**, code blocks, tables, and more.
```

### Roadmap

Edit `content/roadmap.md` with the same frontmatter format (without `order`).

After saving, refresh the page to see your changes.

## Project Structure

```
src/
  app/              # Next.js pages
  components/       # UI components
  lib/              # Content loader, search, progress helpers
content/
  roadmap.md
  topics/           # One markdown file per topic
```

## Deploy to Vercel

1. Push the project to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Deploy — Vercel auto-detects Next.js

No environment variables required for v1.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- shadcn/ui
- gray-matter + react-markdown
- Fuse.js (search)
- next-themes (dark mode)
