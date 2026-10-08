import { useEffect } from "react";

import { appHref } from "../base.js";
import { SoftImage } from "../components/SoftMedia.jsx";
import { blogPosts } from "../data/blog.js";

export function BlogPage({ onNavigate }) {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.15 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const open = (event, href) => {
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <div className="blog">
      <header className="blog-hero">
        <h1>Blog</h1>
        <p>
          Notes on design systems, conversion, and complex product UX from Do Not Press design —
          written from shipping work with startups and larger teams
        </p>
      </header>
      <section className="blog-list" aria-label="Articles">
        <div className="blog-rule" />
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <a
              className="blog-card"
              data-reveal
              href={appHref(post.href)}
              key={post.slug}
              onClick={(event) => open(event, post.href)}
            >
              <div className="blog-card-media">
                {post.cover ? <SoftImage src={post.cover} alt="" /> : null}
                <span className="blog-tag">{post.tags[0]}</span>
              </div>
              <h2>{post.title}</h2>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
