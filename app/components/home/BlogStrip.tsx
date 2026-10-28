'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  date: string | null;
  tags: string[];
  cover: string | null;
}

function BlogCard({ post, delay }: { post: BlogPost; delay: number }) {
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <Link
      href={`/blog/${post.id}`}
      className="home-blog-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="home-blog-cover">
        {post.cover ? (
          <img src={post.cover} alt={post.title} loading="lazy" />
        ) : (
          <div className="home-blog-cover-placeholder" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="7" y="12" width="34" height="25" rx="5" stroke="currentColor" strokeWidth="2" />
              <path d="m9 16 15 11 15-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="home-blog-body">
        {post.tags.length > 0 && (
          <div className="home-blog-tags">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="home-blog-tag">{tag}</span>
            ))}
          </div>
        )}
        <h3 className="home-blog-title">{post.title}</h3>
        {dateStr && (
          <div className="home-blog-date">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {dateStr}
          </div>
        )}
      </div>
    </Link>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div className="home-blog-card home-blog-skeleton" aria-hidden="true" key={index}>
      <div className="home-blog-cover home-blog-skeleton-img" />
      <div className="home-blog-body">
        <div className="home-blog-skeleton-line short" />
        <div className="home-blog-skeleton-line full" />
        <div className="home-blog-skeleton-line med" />
        <div className="home-blog-skeleton-line date" />
      </div>
    </div>
  );
}

export default function BlogStrip() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPosts(data.slice(0, 4)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="home-blog-section" aria-labelledby="home-blog-title">
      <div className="home-blog-header">
        <div className="home-blog-heading">
          <span className="home-blog-eyebrow">From the BlackMail blog</span>
          <h2 id="home-blog-title">A little more inbox know-how</h2>
          <p>Fresh reads on privacy, safer sign-ups, and temporary email.</p>
        </div>
        <div className="home-blog-actions">
          <Link href="/blog" className="home-blog-viewall">Explore all articles <span aria-hidden="true">↗</span></Link>
          <div className="home-blog-controls" aria-label="Blog carousel controls">
            <button
              type="button"
              aria-label="Scroll to previous articles"
              onClick={() => trackRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Scroll to next articles"
              onClick={() => trackRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="home-blog-track" ref={trackRef} role="region" aria-label="Latest blog articles" tabIndex={0}>
        {loading
          ? [0, 1, 2, 3].map((index) => <SkeletonCard key={index} index={index} />)
          : posts.map((p, i) => <BlogCard key={p.id} post={p} delay={i * 60} />)
        }
      </div>
    </section>
  );
}
