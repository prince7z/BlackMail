import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getBlogPostSummary } from "../lib/notion-blog";
import { siteName, siteUrl } from "../lib/seo";

type BlogLayoutProps = {
  children: ReactNode;
  params: Promise<{ id?: string }>;
};

export async function generateMetadata({ params }: BlogLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const blogUrl = `${siteUrl}/blog`;

  if (!id) {
    return {
      title: "Insights & Guides",
      description: "Tips and practical guides about temporary email, privacy, and staying spam-free.",
      alternates: { canonical: blogUrl },
      openGraph: {
        type: "website",
        url: blogUrl,
        title: `Insights & Guides | ${siteName}`,
        description: "Tips and practical guides about temporary email, privacy, and staying spam-free.",
      },
    };
  }

  try {
    const post = await getBlogPostSummary(id);
    if (!post) {
      return {
        title: "Article not found",
        alternates: { canonical: `${blogUrl}/${id}` },
        robots: { index: false, follow: true },
      };
    }

    const description = post.tags.length > 0
      ? `${post.title} — a BlackMail guide about ${post.tags.join(", ")}.`
      : `${post.title} — insights and guidance from the BlackMail blog.`;
    const articleUrl = `${blogUrl}/${post.id}`;

    return {
      title: post.title,
      description,
      alternates: { canonical: articleUrl },
      openGraph: {
        type: "article",
        url: articleUrl,
        title: post.title,
        description,
        ...(post.cover ? { images: [post.cover] } : {}),
        ...(post.date ? { publishedTime: post.date } : {}),
        ...(post.author ? { authors: [post.author] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        ...(post.cover ? { images: [post.cover] } : {}),
      },
    };
  } catch (error) {
    console.error(`Failed to generate metadata for blog article ${id}`, error);
    return {
      title: "BlackMail Blog",
      alternates: { canonical: `${blogUrl}/${id}` },
      robots: { index: false, follow: true },
    };
  }
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return children;
}
