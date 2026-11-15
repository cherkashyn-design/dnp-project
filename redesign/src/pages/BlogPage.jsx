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
      { rootMargin: "0px", threshold: 0 },
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
          Methods for founders and product teams: AI tools, B2B SaaS, brand systems, launches and
          conversion, each with a case as the worked example
        </p>
      </header>
      <section className="blog-list" aria-label="Articles">
        <div className="blog-rule" />
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <a
              className="blog-card"
              data-reveal
              // An article with its text on the site opens here; an older one still lives on Medium.
              {...(post.content
                ? { href: appHref(`/blog/${post.slug}`), onClick: (event) => open(event, `/blog/${post.slug}`) }
                : { href: post.href, rel: "noreferrer", target: "_blank" })}
              key={post.slug}
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
