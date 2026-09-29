"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { use } from "react";
import "../../styles/blog.css";

/* ── Types ───────────────────────────────────── */
interface BlogPost {
  id: string;
  title: string;
  date: string | null;
  tags: string[];
  cover: string | null;
  author: string | null;
  content: NotionBlock[];
}

interface NotionRichText {
  plain_text?: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
  };
  text?: { link?: { url?: string } | null };
}

interface NotionBlock {
  id?: string;
  type?: string;
  children?: NotionBlock[];
  [key: string]: any;
}

/* ── Rich text renderer ──────────────────────── */
function RichText({ items = [] }: { items?: NotionRichText[] }) {
  if (!items.length) return null;
  return (
    <>
      {items.map((t, i) => {
        let node: ReactNode = t.plain_text ?? "";
        if (t.annotations?.code)          node = <code key={`c${i}`}>{node}</code>;
        if (t.annotations?.bold)          node = <strong key={`b${i}`}>{node}</strong>;
        if (t.annotations?.italic)        node = <em key={`e${i}`}>{node}</em>;
        if (t.annotations?.strikethrough) node = <s key={`s${i}`}>{node}</s>;
        if (t.annotations?.underline)     node = <u key={`u${i}`}>{node}</u>;
        const href = t.href ?? t.text?.link?.url;
        if (href) node = <a key={`a${i}`} href={href} target="_blank" rel="noopener noreferrer">{node}</a>;
        return <span key={`sp${i}`}>{node}</span>;
      })}
    </>
  );
}

/* ── Block renderer ──────────────────────────── */
function Block({ block }: { block: NotionBlock }) {
  const type = block.type;
  const data = type ? block[type] : null;

  switch (type) {
    case "paragraph":
      return <p className="blog-para"><RichText items={data?.rich_text} /></p>;
    case "heading_1":
      return <h1 className="blog-h1"><RichText items={data?.rich_text} /></h1>;
    case "heading_2":
      return <h2 className="blog-h2"><RichText items={data?.rich_text} /></h2>;
    case "heading_3":
      return <h3 className="blog-h3"><RichText items={data?.rich_text} /></h3>;
    case "code":
      return (
        <pre className="blog-code-block">
          <code><RichText items={data?.rich_text} /></code>
        </pre>
      );
    case "quote":
      return <blockquote className="blog-quote"><RichText items={data?.rich_text} /></blockquote>;
    case "divider":
      return <hr className="blog-divider" />;
    case "callout":
      return (
        <div className="blog-callout">
          {data?.icon?.emoji && <span>{data.icon.emoji}</span>}
          <div><RichText items={data?.rich_text} /></div>
        </div>
      );
    case "image": {
      const src = data?.external?.url ?? data?.file?.url;
      const caption = data?.caption?.[0]?.plain_text ?? "";
      return src ? (
        <figure className="blog-image-wrap">
          <img src={src} alt={caption || "Blog image"} className="blog-image" loading="lazy" />
          {data?.caption?.length > 0 && (
            <figcaption className="blog-image-caption"><RichText items={data.caption} /></figcaption>
          )}
        </figure>
      ) : null;
    }
    case "table": {
      const rows = (block.children ?? []).filter((c: NotionBlock) => c.type === "table_row");
      if (!rows.length) return null;
      return (
        <div className="blog-table-wrap">
          <table className="blog-table">
            <tbody>
              {rows.map((row: NotionBlock, ri: number) => (
                <tr key={row.id ?? ri}>
                  {(row.table_row?.cells ?? []).map((cell: NotionRichText[], ci: number) => (
                    <td key={`${row.id ?? ri}-${ci}`}><RichText items={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    default:
      return null;
  }
}

/* ── Content renderer (handles lists) ───────── */
function PostContent({ blocks }: { blocks: NotionBlock[] }) {
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const type = block?.type;

    if (type === "bulleted_list_item" || type === "numbered_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i]?.type === type) {
        items.push(blocks[i]);
        i++;
      }
      const Tag = type === "bulleted_list_item" ? "ul" : "ol";
      elements.push(
        <Tag className="blog-list" key={`list-${i}`}>
          {items.map((item, idx) => (
            <li className="blog-list-item" key={item.id ?? idx}>
              <RichText items={item[type]?.rich_text} />
            </li>
          ))}
        </Tag>
      );
      continue;
    }

    elements.push(
      <div className="blog-block" key={block.id ?? i}>
        <Block block={block} />
      </div>
    );
    i++;
  }

  return <>{elements}</>;
}

/* ── Reading progress hook ───────────────────── */
function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return progress;
}

/* ── Main page ───────────────────────────────── */
export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const progress = useReadingProgress();

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPost(data);
      })
      .catch(() => setError("Failed to load post"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="blog-post-loading-wrap">
        <div className="blog-spinner" />
        <span>Loading post…</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-error-wrap">
        <p>{error || "Post not found"}</p>
        <Link href="/blog">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7M19 12H5"/>
          </svg>
          Back to Blog
        </Link>
      </div>
    );
  }

  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="blog-post-root">
      {/* Reading progress bar */}
      <div
        className="blog-progress"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Top bar */}
      <nav className="blog-topbar">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: '#f0f0f0', textDecoration: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          BlackMail
        </Link>
        <Link href="/blog" className="blog-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7M19 12H5"/>
          </svg>
          All Posts
        </Link>
      </nav>

      {/* Cover image */}
      {post.cover && (
        <div className="blog-post-cover">
          <img src={post.cover} alt={post.title} />
        </div>
      )}

      {/* Article */}
      <article className="blog-post-article">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="blog-post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-post-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="blog-post-title">{post.title}</h1>

        {/* Meta */}
        <div className="blog-post-meta">
          {post.author && (
            <div className="blog-post-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
              {post.author}
            </div>
          )}
          {dateStr && (
            <div className="blog-post-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              {dateStr}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="blog-post-content">
          <PostContent blocks={post.content as NotionBlock[]} />
        </div>
      </article>
    </div>
  );
}
