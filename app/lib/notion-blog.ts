import { Client, collectPaginatedAPI, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export interface BlogPostSummary {
  id: string;
  title: string;
  date: string | null;
  lastModified: string;
  tags: string[];
  cover: string | null;
  author: string | null;
}

function createNotionClient() {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error("NOTION_TOKEN is required to load blog posts.");
  }

  return new Client({ auth: token });
}

function getDatabaseId() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is required to load blog posts.");
  }

  return databaseId;
}

function summarizePage(page: PageObjectResponse): BlogPostSummary {
  const titleProperty = page.properties.Name;
  const publishedProperty = page.properties.Published;
  const tagsProperty = page.properties.Tags;
  const authorProperty = page.properties.Author;
  const cover = page.cover;

  return {
    id: page.id,
    title: titleProperty?.type === "title"
      ? titleProperty.title.map((item) => item.plain_text).join("") || "Untitled"
      : "Untitled",
    date: publishedProperty?.type === "date" ? publishedProperty.date?.start ?? null : null,
    lastModified: page.last_edited_time,
    tags: tagsProperty?.type === "multi_select" ? tagsProperty.multi_select.map((tag) => tag.name) : [],
    cover: cover?.type === "external"
      ? cover.external.url
      : cover?.type === "file"
        ? cover.file.url
        : null,
    author: authorProperty?.type === "rich_text"
      ? authorProperty.rich_text.map((item) => item.plain_text).join("") || null
      : null,
  };
}

export async function getBlogPostSummaries(): Promise<BlogPostSummary[]> {
  const notion = createNotionClient();
  const pages = await collectPaginatedAPI(notion.databases.query, {
    database_id: getDatabaseId(),
    sorts: [{ property: "Published", direction: "descending" }],
  });

  return pages.filter(isFullPage).map(summarizePage);
}

export async function getBlogPostSummary(id: string): Promise<BlogPostSummary | null> {
  const notion = createNotionClient();
  const page = await notion.pages.retrieve({ page_id: id });

  return isFullPage(page) ? summarizePage(page) : null;
}
