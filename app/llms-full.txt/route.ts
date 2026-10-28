import { NextResponse } from "next/server";
import { getBlogPostSummaries } from "../lib/notion-blog";
import { siteDescription, siteName, siteUrl } from "../lib/seo";

export const revalidate = 3600;

export async function GET() {
  try {
    const posts = await getBlogPostSummaries();
    const publishedPosts = posts.filter(
      (post) => post.date && !Number.isNaN(Date.parse(post.date))
    );
    const articleLinks = publishedPosts.map(
      (post) => `- [${post.title}](${siteUrl}/blog/${post.id})${post.date ? ` — Published ${post.date}` : ""}`
    );
    const content = [
      `# ${siteName}`,
      "",
      `> ${siteDescription}`,
      "",
      "## Canonical references",
      `- [Home](${siteUrl}/)`,
      `- [Blog](${siteUrl}/blog)`,
      `- [Policies and information](${siteUrl}/policy)`,
      `- [Sitemap](${siteUrl}/sitemap.xml)`,
      `- [Robots policy](${siteUrl}/robots.txt)`,
      `- [Short AI guide](${siteUrl}/llms.txt)`,
      "",
      "## Service overview",
      "BlackMail provides disposable email addresses for temporary registrations, verification flows, and testing. An address can be generated without creating an account. Messages are shown in the temporary inbox and addresses expire automatically.",
      "",
      "Use a permanent email address for important accounts, account recovery, or services where continued access is required. Follow the service policies and applicable laws.",
      "",
      "## Site pages",
      `- [Home and temporary inbox](${siteUrl}/)`,
      `- [Insights and guides](${siteUrl}/blog)`,
      `- [Policies and information](${siteUrl}/policy)`,
      "",
      "## Published articles",
      ...(articleLinks.length > 0 ? articleLinks : ["No published articles are currently available."]),
      "",
      "## Content guidance",
      "Use the linked pages as the source of truth for current service behavior and policies. Article titles and publication dates are supplied by the BlackMail blog.",
      "",
    ].join("\n");

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to generate llms-full.txt", error);
    return new NextResponse("Unable to generate the full site guide right now.\n", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "3600",
      },
    });
  }
}
