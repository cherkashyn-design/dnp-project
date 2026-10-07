import { useEffect, useMemo, useState } from "react";

import copyIcon from "../assets/icons/share-copy.svg";
import instagramIcon from "../assets/icons/share-instagram.svg";
import linkedinIcon from "../assets/icons/share-linkedin.svg";
import xIcon from "../assets/icons/share-x.svg";
import { appHref } from "../base.js";
import { getBlogPost } from "../data/blog.js";

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readingMinutes(content) {
  const words = content.reduce((count, block) => {
    const bits = [block.text, block.caption, ...(block.items || [])];
    if (block.parts) {
      bits.push(...block.parts.map((part) => (typeof part === "string" ? part : part.label)));
    }
    return (
      count +
      bits
        .filter(Boolean)
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length
    );
  }, 0);
  return Math.max(1, Math.round(words / 220));
}

function Inline({ value, onNavigate }) {
  if (!value) return null;
  const chunks = String(value).split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return chunks.map((chunk, index) => {
    if (chunk.startsWith("`") && chunk.endsWith("`") && chunk.length >= 2) {
      return <code key={index}>{chunk.slice(1, -1)}</code>;
    }
    const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <ArticleLink href={link[2]} key={index} onNavigate={onNavigate}>
          {link[1]}
        </ArticleLink>
      );
    }
    return <span key={index}>{chunk}</span>;
  });
}

function ArticleLink({ href, children, onNavigate }) {
  const internal = href.startsWith("/");
  return (
    <a
      href={internal ? appHref(href) : href}
      onClick={
        internal
          ? (event) => {
              event.preventDefault();
              onNavigate(href);
            }
          : undefined
      }
      rel={internal ? undefined : "noreferrer"}
      target={internal ? undefined : "_blank"}
    >
      {children}
    </a>
  );
}

function ArticleBody({ content, onNavigate }) {
  return (
    <div className="article-body">
      {content.map((block, index) => {
        const key = `block-${index}`;
        if (block.type === "h2") {
          return (
            <h2 id={slugify(block.text)} key={key}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") return <h3 key={key}>{block.text}</h3>;
        if (block.type === "ul" || block.type === "ol") {
          const Tag = block.type;
          return (
            <Tag key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {typeof item === "string" ? (
                    <Inline onNavigate={onNavigate} value={item} />
                  ) : (
                    item
                  )}
                </li>
              ))}
            </Tag>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={key}>
              <Inline onNavigate={onNavigate} value={block.text} />
            </blockquote>
          );
        }
        if (block.type === "note") {
          return (
            <p className="article-note" key={key}>
              <Inline onNavigate={onNavigate} value={block.text} />
            </p>
          );
        }
        if (block.type === "image") {
          return (
            <figure className="article-figure" data-ink key={key}>
              <img alt={block.alt || block.caption || ""} src={block.src} />
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          );
        }
        if (block.parts) {
          return (
            <p key={key}>
              {block.parts.map((part, partIndex) =>
                typeof part === "string" ? (
                  <Inline key={partIndex} onNavigate={onNavigate} value={part} />
                ) : (
                  <ArticleLink href={part.href} key={partIndex} onNavigate={onNavigate}>
                    {part.label}
                  </ArticleLink>
                ),
              )}
            </p>
          );
        }
        return (
          <p key={key}>
            <Inline onNavigate={onNavigate} value={block.text} />
          </p>
        );
      })}
    </div>
  );
}

export function ArticlePage({ slug, onNavigate }) {
  const post = getBlogPost(slug);
  const headings = useMemo(
    () => (post?.content || []).filter((block) => block.type === "h2").map((block) => block.text),
    [post],
  );
  const [active, setActive] = useState(headings[0] || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!headings.length) return undefined;
    const nodes = headings
      .map((heading) => document.getElementById(slugify(heading)))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.textContent);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings, slug]);

  if (!post) {
    return (
      <header className="blog-hero">
        <h1>Article not found</h1>
        <p>
          <a
            href={appHref("/blog")}
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/blog");
            }}
          >
            Back to the blog
          </a>
        </p>
      </header>
    );
  }

  const share = (href) => window.open(href, "_blank", "noopener,noreferrer");
  const pageUrl = () => window.location.href;

  return (
    <article className="article">
      <header className="article-hero">
        <div className="article-intro">
          <span className="article-kicker">{post.tags[0]}</span>
          <div className="article-heading">
          <h1>{post.title}</h1>
          <p className="article-meta">
            <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
            <span className="meta-dot" />
            <span>{readingMinutes(post.content)} min</span>
            <span className="meta-dot" />
            <span className="article-by">By Maksym Cherkashyn</span>
          </p>
          </div>
        </div>
        {post.cover ? (
          <div className="article-cover" data-ink>
            <img alt="" src={post.cover} />
          </div>
        ) : null}
      </header>
      <div className="article-layout">
        <aside className="article-side">
          <nav aria-label="On this page">
            {headings.map((heading) => (
              <a
                className={heading === active ? "is-active" : ""}
                href={`#${slugify(heading)}`}
                key={heading}
                onClick={(event) => {
                  event.preventDefault();
                  setActive(heading);
                  document.getElementById(slugify(heading))?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {heading}
              </a>
            ))}
          </nav>
          <div className="article-share">
            <p>Share Article</p>
            <div>
              <button
                aria-label={copied ? "Link copied" : "Copy link"}
                className={copied ? "is-copied" : ""}
                onClick={() => {
                  navigator.clipboard.writeText(pageUrl()).then(
                    () => {
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1600);
                    },
                    () => setCopied(false),
                  );
                }}
                type="button"
              >
                <img alt="" src={copyIcon} />
              </button>
              <button
                aria-label="Share on X"
                onClick={() =>
                  share(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl())}`,
                  )
                }
                type="button"
              >
                <img alt="" src={xIcon} />
              </button>
              <button
                aria-label="Share on LinkedIn"
                onClick={() =>
                  share(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl())}`,
                  )
                }
                type="button"
              >
                <img alt="" src={linkedinIcon} />
              </button>
              <button
                aria-label="Share on Instagram"
                onClick={() => share("https://www.instagram.com/")}
                type="button"
              >
                <img alt="" src={instagramIcon} />
              </button>
            </div>
          </div>
        </aside>
        <ArticleBody content={post.content} onNavigate={onNavigate} />
      </div>
    </article>
  );
}
