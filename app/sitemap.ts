import type { MetadataRoute } from "next";
import { getBlogPostSummaries, type BlogPostSummary } from "./lib/notion-blog";
import { siteUrl } from "./lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPostSummaries();
  const publishedPosts = posts.filter(
    (post): post is BlogPostSummary & { date: string } =>
      typeof post.date === "string" && !Number.isNaN(Date.parse(post.date))
  );

  return [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/policy`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...publishedPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.id}`,
      lastModified: new Date(post.lastModified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
