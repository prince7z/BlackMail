'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Icons } from '../components/Icons';
import BlogNav from '../components/BlogNav';
import '../styles/blog.css';


interface BlogPost {
  id: string;
  title: string;
  date: string | null;
  tags: string[];
  cover: string | null;
}

/* ── Sub-components ──────────────────────────── */

function SkeletonCard() {
  return (
    <div className="blog-skeleton-card">
      <div className="blog-skeleton-img" />
      <div className="blog-skeleton-body">
        <div className="blog-skeleton-line short" />
        <div className="blog-skeleton-line full" />
        <div className="blog-skeleton-line med" />
        <div className="blog-skeleton-line date" />
      </div>
    </div>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={`/blog/${post.id}`} className="blog-card">
      <div className="blog-card-cover">
        {post.cover ? (
          <img src={post.cover} alt={post.title} loading="lazy" />
        ) : (
          <div className="blog-card-cover-placeholder">✉</div>
        )}
      </div>

      <div className="blog-card-body">
        {post.tags.length > 0 && (
          <div className="blog-card-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="blog-card-tag">{tag}</span>
            ))}
          </div>
        )}

        <h2 className="blog-card-title">{post.title}</h2>

        {dateStr && (
          <div className="blog-card-date">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {dateStr}
          </div>
        )}
      </div>

      <div className="blog-card-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M7 7h10v10"/>
        </svg>
      </div>
    </Link>
  );
}

/* ── Main page ───────────────────────────────── */
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* collect all unique tags */
  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  /* filtered posts */
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [posts, search, activeTag]);

  return (
    <div className="blog-root">
      <BlogNav backHref="/" backLabel="Home" />

      {/* ── Hero ── */}
      <header className="blog-hero">
        <div className="blog-hero-eyebrow">
          <span className="blog-hero-dot" />
          BlackMail Blog
        </div>
        <h1>Insights &amp; Guides</h1>
        <p>Tips, updates, and deep-dives about temporary email, privacy, and staying spam-free.</p>
      </header>

      {/* ── Controls ── */}
      <div className="blog-controls">
        {/* Search */}
        <div className="blog-search-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            id="blog-search"
            type="text"
            className="blog-search-input"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search blog posts"
          />
        </div>

        {/* Tag filter */}
        {!loading && allTags.length > 0 && (
          <div className="blog-tag-filter" role="group" aria-label="Filter by tag">
            <span className="blog-filter-label">Filter:</span>
            <button
              id="tag-filter-all"
              className={`blog-tag-btn${activeTag === null ? ' active' : ''}`}
              onClick={() => setActiveTag(null)}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                id={`tag-filter-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                className={`blog-tag-btn${activeTag === tag ? ' active' : ''}`}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Post count ── */}
      {!loading && (
        <p className="blog-count">
          {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
          {(search || activeTag) && ' found'}
        </p>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="blog-skeleton-grid">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="blog-empty">
          <div className="blog-empty-icon">🔍</div>
          <h3>No posts found</h3>
          <p>Try a different search term or tag.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
